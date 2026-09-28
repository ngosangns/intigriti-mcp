#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE_URL = "https://api.intigriti.com/external/researcher/v1";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class IntigritiServer {
  constructor() {
    this.server = new Server(
      {
        name: "intigriti-mcp-server",
        version: "1.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.apiToken = process.env.INTIGRITI_API_TOKEN;

    if (!this.apiToken) {
      console.error("Warning: INTIGRITI_API_TOKEN environment variable not set");
    }

    this.setupHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.apiToken}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API request failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        `Failed to make request to ${endpoint}: ${error.message}`
      );
    }
  }

  // The API requires program UUIDs. Accept a UUID directly, or resolve a
  // handle ("lansweeper1" or "lansweeper/lansweeper1") via the programs list.
  async resolveProgramId(programId) {
    if (UUID_RE.test(programId)) return programId;

    const handle = programId.split("/").pop();
    const data = await this.makeRequest("/programs?limit=500");
    const match = (data.records || []).find((p) => p.handle === handle);
    if (!match) {
      throw new Error(
        `Unknown program '${programId}'. Use intigriti_list_programs to find the UUID.`
      );
    }
    return match.id;
  }

  static jsonResult(data) {
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "intigriti_list_programs",
          description:
            "List all bug bounty programs on Intigriti that you have access to as a researcher. Returns program id, handle, name, status, type, confidentiality and bounty range.",
          inputSchema: {
            type: "object",
            properties: {
              status_id: {
                type: "number",
                description: "Optional: filter by program status id",
              },
              type_id: {
                type: "number",
                description: "Optional: filter by program type id",
              },
              following: {
                type: "boolean",
                description:
                  "Optional: only programs you follow (true) or don't follow (false)",
              },
              limit: {
                type: "number",
                description:
                  "Optional: max results per call (max 500, default 50)",
              },
              offset: {
                type: "number",
                description: "Optional: number of records to skip",
              },
            },
          },
        },
        {
          name: "intigriti_get_program",
          description:
            "Get detailed information about a program: latest scope (domains) and rules of engagement versions, bounty table, confidentiality, status.",
          inputSchema: {
            type: "object",
            properties: {
              program_id: {
                type: "string",
                description:
                  "Program UUID, or handle (e.g. 'lansweeper1' or 'lansweeper/lansweeper1')",
              },
            },
            required: ["program_id"],
          },
        },
        {
          name: "intigriti_get_program_scope",
          description:
            "Get a program's in-scope and out-of-scope assets (domains version). Without version_id returns the latest version embedded in the program details.",
          inputSchema: {
            type: "object",
            properties: {
              program_id: {
                type: "string",
                description: "Program UUID or handle",
              },
              version_id: {
                type: "string",
                description:
                  "Optional: specific domains version UUID (from program details or program activities)",
              },
            },
            required: ["program_id"],
          },
        },
        {
          name: "intigriti_get_program_roe",
          description:
            "Get a program's rules of engagement: policy text, testing requirements (intigriti.me email, automated tooling rating, required User-Agent/request header) and safe-harbour flag.",
          inputSchema: {
            type: "object",
            properties: {
              program_id: {
                type: "string",
                description: "Program UUID or handle",
              },
              version_id: {
                type: "string",
                description:
                  "Optional: specific ROE version UUID (from program details or program activities)",
              },
            },
            required: ["program_id"],
          },
        },
        {
          name: "intigriti_list_program_activities",
          description:
            "List program change events (scope/ROE version changes, status changes, new programs). Use created_since (unix epoch) to poll for changes since your last check.",
          inputSchema: {
            type: "object",
            properties: {
              created_since: {
                type: "number",
                description:
                  "Optional: only activities created after this unix epoch timestamp",
              },
              following: {
                type: "boolean",
                description:
                  "Optional: only activities for programs you follow",
              },
              limit: {
                type: "number",
                description:
                  "Optional: max results per call (max 500, default 50)",
              },
              offset: {
                type: "number",
                description: "Optional: number of records to skip",
              },
            },
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case "intigriti_list_programs":
            return await this.listPrograms(args);

          case "intigriti_get_program":
            return await this.getProgram(args.program_id);

          case "intigriti_get_program_scope":
            return await this.getProgramScope(args.program_id, args.version_id);

          case "intigriti_get_program_roe":
            return await this.getProgramRoe(args.program_id, args.version_id);

          case "intigriti_list_program_activities":
            return await this.listProgramActivities(args);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async listPrograms(args = {}) {
    const params = new URLSearchParams();
    if (args.status_id != null) params.append("statusId", args.status_id);
    if (args.type_id != null) params.append("typeId", args.type_id);
    if (args.following != null) params.append("following", args.following);
    if (args.limit != null) params.append("limit", args.limit);
    if (args.offset != null) params.append("offset", args.offset);

    const qs = params.toString();
    const data = await this.makeRequest(`/programs${qs ? `?${qs}` : ""}`);
    return IntigritiServer.jsonResult(data);
  }

  async getProgram(programId) {
    const id = await this.resolveProgramId(programId);
    const data = await this.makeRequest(`/programs/${id}`);
    return IntigritiServer.jsonResult(data);
  }

  async getProgramScope(programId, versionId) {
    const id = await this.resolveProgramId(programId);

    if (versionId) {
      const data = await this.makeRequest(
        `/programs/${id}/domains/${versionId}`
      );
      return IntigritiServer.jsonResult(data);
    }

    const program = await this.makeRequest(`/programs/${id}`);
    return IntigritiServer.jsonResult({ domains: program.domains });
  }

  async getProgramRoe(programId, versionId) {
    const id = await this.resolveProgramId(programId);

    if (versionId) {
      const data = await this.makeRequest(
        `/programs/${id}/rules-of-engagements/${versionId}`
      );
      return IntigritiServer.jsonResult(data);
    }

    const program = await this.makeRequest(`/programs/${id}`);
    return IntigritiServer.jsonResult({
      rulesOfEngagement: program.rulesOfEngagement,
    });
  }

  async listProgramActivities(args = {}) {
    const params = new URLSearchParams();
    if (args.created_since != null)
      params.append("createdSince", args.created_since);
    if (args.following != null) params.append("following", args.following);
    if (args.limit != null) params.append("limit", args.limit);
    if (args.offset != null) params.append("offset", args.offset);

    const qs = params.toString();
    const data = await this.makeRequest(
      `/programs/activities${qs ? `?${qs}` : ""}`
    );
    return IntigritiServer.jsonResult(data);
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Intigriti MCP Server running on stdio");
  }
}

const server = new IntigritiServer();
server.run().catch(console.error);
