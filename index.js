#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE_URL = "https://api.intigriti.com/external/researcher/v1";

class IntigritiServer {
  constructor() {
    this.server = new Server(
      {
        name: "intigriti-mcp-server",
        version: "1.0.0",
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
      "Authorization": `Bearer ${this.apiToken}`,
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
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to make request to ${endpoint}: ${error.message}`);
    }
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "intigriti_list_programs",
          description: "List all available bug bounty programs on Intigriti that you have access to as a researcher. Returns program details including name, company, status, and rewards.",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "intigriti_get_program",
          description: "Get detailed information about a specific bug bounty program including scope, rewards, policy, response targets, and submission statistics.",
          inputSchema: {
            type: "object",
            properties: {
              program_id: {
                type: "string",
                description: "The unique identifier of the program (format: company_handle/program_handle or UUID)",
              },
            },
            required: ["program_id"],
          },
        },
        {
          name: "intigriti_get_program_scope",
          description: "Get the in-scope and out-of-scope assets (targets) for a specific program. Returns detailed scope information including endpoints, domains, and applications.",
          inputSchema: {
            type: "object",
            properties: {
              program_id: {
                type: "string",
                description: "The unique identifier of the program",
              },
            },
            required: ["program_id"],
          },
        },
        {
          name: "intigriti_list_submissions",
          description: "List your bug submissions across all programs or for a specific program. Filter by status, severity, or date range.",
          inputSchema: {
            type: "object",
            properties: {
              program_id: {
                type: "string",
                description: "Optional: Filter by specific program ID",
              },
              status: {
                type: "string",
                description: "Optional: Filter by submission status (e.g., 'open', 'closed', 'accepted', 'duplicate')",
                enum: ["open", "closed", "accepted", "duplicate", "na", "informative"],
              },
              limit: {
                type: "number",
                description: "Optional: Maximum number of results to return (default: 50)",
                default: 50,
              },
            },
          },
        },
        {
          name: "intigriti_get_submission",
          description: "Get detailed information about a specific bug submission including description, severity, status, and all communication.",
          inputSchema: {
            type: "object",
            properties: {
              submission_id: {
                type: "string",
                description: "The unique identifier of the submission (UUID)",
              },
            },
            required: ["submission_id"],
          },
        },
        {
          name: "intigriti_create_submission",
          description: "Submit a new bug report to a program. Include title, description, severity, proof of concept, and affected endpoint.",
          inputSchema: {
            type: "object",
            properties: {
              program_id: {
                type: "string",
                description: "The unique identifier of the program to submit to",
              },
              title: {
                type: "string",
                description: "Brief title of the vulnerability",
              },
              description: {
                type: "string",
                description: "Detailed description of the vulnerability",
              },
              severity: {
                type: "string",
                description: "Severity level of the vulnerability",
                enum: ["critical", "high", "medium", "low", "none"],
              },
              proof_of_concept: {
                type: "string",
                description: "Steps to reproduce and proof of concept",
              },
              endpoint: {
                type: "string",
                description: "The affected endpoint/URL from the program scope",
              },
              vulnerability_type: {
                type: "string",
                description: "Type of vulnerability (e.g., 'XSS', 'SQL Injection', 'CSRF')",
              },
            },
            required: ["program_id", "title", "description", "severity", "proof_of_concept", "endpoint"],
          },
        },
        {
          name: "intigriti_add_submission_comment",
          description: "Add a comment or update to an existing submission. Use this to respond to questions from the program team or provide additional information.",
          inputSchema: {
            type: "object",
            properties: {
              submission_id: {
                type: "string",
                description: "The unique identifier of the submission",
              },
              comment: {
                type: "string",
                description: "The comment text to add",
              },
            },
            required: ["submission_id", "comment"],
          },
        },
        {
          name: "intigriti_get_researcher_stats",
          description: "Get your researcher statistics including total submissions, acceptance rate, reputation score, and earnings.",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case "intigriti_list_programs":
            return await this.listPrograms();
          
          case "intigriti_get_program":
            return await this.getProgram(args.program_id);
          
          case "intigriti_get_program_scope":
            return await this.getProgramScope(args.program_id);
          
          case "intigriti_list_submissions":
            return await this.listSubmissions(args);
          
          case "intigriti_get_submission":
            return await this.getSubmission(args.submission_id);
          
          case "intigriti_create_submission":
            return await this.createSubmission(args);
          
          case "intigriti_add_submission_comment":
            return await this.addSubmissionComment(args.submission_id, args.comment);
          
          case "intigriti_get_researcher_stats":
            return await this.getResearcherStats();
          
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

  async listPrograms() {
    const data = await this.makeRequest("/programs");
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async getProgram(programId) {
    const data = await this.makeRequest(`/programs/${programId}`);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async getProgramScope(programId) {
    const data = await this.makeRequest(`/programs/${programId}/scope`);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async listSubmissions(args) {
    let endpoint = "/submissions";
    const params = new URLSearchParams();
    
    if (args.program_id) {
      params.append("programId", args.program_id);
    }
    if (args.status) {
      params.append("status", args.status);
    }
    if (args.limit) {
      params.append("limit", args.limit.toString());
    }
    
    const queryString = params.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }
    
    const data = await this.makeRequest(endpoint);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async getSubmission(submissionId) {
    const data = await this.makeRequest(`/submissions/${submissionId}`);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async createSubmission(args) {
    const payload = {
      programId: args.program_id,
      title: args.title,
      description: args.description,
      severity: args.severity,
      proofOfConcept: args.proof_of_concept,
      endpoint: args.endpoint,
      vulnerabilityType: args.vulnerability_type,
    };
    
    const data = await this.makeRequest("/submissions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async addSubmissionComment(submissionId, comment) {
    const payload = {
      message: comment,
    };
    
    const data = await this.makeRequest(`/submissions/${submissionId}/comments`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async getResearcherStats() {
    const data = await this.makeRequest("/researcher/stats");
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Intigriti MCP Server running on stdio");
  }
}

const server = new IntigritiServer();
server.run().catch(console.error);
