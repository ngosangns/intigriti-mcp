# Intigriti MCP Server

A Model Context Protocol (MCP) server for interacting with the Intigriti bug bounty platform's Researcher API. This enables AI assistants like Claude to help security researchers browse programs, check scope and rules of engagement, and monitor program changes.

> **Note:** The Intigriti Researcher API only exposes program data (list, details, scope versions, ROE versions, activity feed). It does **not** expose submissions or researcher stats — those are only available on [app.intigriti.com](https://app.intigriti.com).

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Features

This MCP server provides comprehensive tools for interacting with Intigriti:

### 📋 Program Management
- **List Programs** - View all available bug bounty programs (filterable by status, type, following)
- **Get Program Details** - Access detailed program information
- **View Scope** - See in-scope and out-of-scope assets (latest or a specific version)
- **View Rules of Engagement** - Policy text, testing requirements, safe-harbour flag

### 🔄 Change Monitoring
- **List Program Activities** - Scope/ROE version changes, status changes, new programs — poll with `created_since`

## 📦 Installation

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- **Intigriti account** with researcher access
- **Intigriti API token**

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Get Your API Token

1. Log in to [Intigriti](https://app.intigriti.com)
2. Navigate to your profile settings
3. Go to the API section
4. Generate a new API token with researcher permissions
5. Copy the token securely

**Note:** You may need to contact Intigriti support to enable API access for your account.

### Step 3: Configure Environment

Create a `.env` file in the project root:

```bash
INTIGRITI_API_TOKEN=your_api_token_here
```

Or export as an environment variable:

```bash
export INTIGRITI_API_TOKEN="your_api_token_here"
```

## 🔧 Configuration

### For Claude Desktop

Add this configuration to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "intigriti": {
      "command": "node",
      "args": [
        "/absolute/path/to/intigriti-mcp-server/index.js"
      ],
      "env": {
        "INTIGRITI_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

**Important:** Replace `/absolute/path/to/intigriti-mcp-server/index.js` with the actual path to your installation.

### For Other MCP Clients

The server runs on stdio transport and can be integrated with any MCP-compatible client. Ensure you:

1. Set the `INTIGRITI_API_TOKEN` environment variable
2. Run the server with Node.js 18+
3. Use stdio for communication

## 📖 Usage Examples

Once configured with Claude Desktop, you can use natural language to interact with Intigriti:

### Viewing Programs

```
"Show me all available bug bounty programs"
"What programs can I participate in on Intigriti?"
"Get details about the [Company Name] program"
"What's the scope for the XYZ program?"
```

### Monitoring Changes

```
"What changed in the programs I follow since last week?"
"Show me recent program activity on Intigriti"
"What are the rules of engagement for the XYZ program?"
```

## 🛠️ Available Tools

### 1. intigriti_list_programs

Lists all bug bounty programs available to you as a researcher.

**Parameters:**
- `status_id` (number, optional) - Filter by program status id
- `type_id` (number, optional) - Filter by program type id
- `following` (boolean, optional) - Only programs you follow / don't follow
- `limit` (number, optional) - Max results (max 500, default 50)
- `offset` (number, optional) - Records to skip

**Returns:** Paginated programs with id, handle, name, status, and bounty range

**Example:**
```
List all available programs
```

### 2. intigriti_get_program

Gets detailed information about a specific program.

**Parameters:**
- `program_id` (string, required) - Program UUID, or handle (`lansweeper1` / `lansweeper/lansweeper1`)

**Returns:** Full program details including latest domains (scope) and rules-of-engagement versions, bounty table, status

**Example:**
```
Get details about program lansweeper1
```

### 3. intigriti_get_program_scope

Retrieves the structured scope for a program.

**Parameters:**
- `program_id` (string, required) - Program UUID or handle
- `version_id` (string, optional) - Specific domains version UUID; omit for the latest version

**Returns:** In-scope and out-of-scope assets

**Example:**
```
What's the scope for program lansweeper1?
```

### 4. intigriti_get_program_roe

Retrieves a program's rules of engagement.

**Parameters:**
- `program_id` (string, required) - Program UUID or handle
- `version_id` (string, optional) - Specific ROE version UUID; omit for the latest version

**Returns:** Policy text, testing requirements (intigriti.me, automated tooling, required headers/User-Agent), safe-harbour flag

**Example:**
```
What are the rules of engagement for lansweeper1?
```

### 5. intigriti_list_program_activities

Lists program change events (scope/ROE version changes, status changes, new programs).

**Parameters:**
- `created_since` (number, optional) - Only activities after this unix epoch timestamp
- `following` (boolean, optional) - Only activities for followed programs
- `limit` (number, optional) - Max results (max 500, default 50)
- `offset` (number, optional) - Records to skip

**Returns:** Paginated activity records with `fromVersionId`/`toVersionId` per activity

**Example:**
```
Show program activities from the last 7 days
```

## 🔒 Security Best Practices

- **Never commit your API token** to version control
- Store tokens in environment variables or secure secret management
- Rotate tokens periodically
- Use tokens with minimum required permissions
- Follow Intigriti's responsible disclosure policies
- Review the `.gitignore` file to ensure secrets are excluded

## ⚠️ Error Handling

The server provides detailed error messages:

- **Authentication errors** - Check your API token validity
- **Permission errors** - Verify researcher access level
- **Not found errors** - Confirm program/submission IDs are correct
- **Rate limit errors** - Wait before making additional requests
- **Network errors** - Check your internet connection

## 🚦 Rate Limits

Intigriti API has rate limits. The server will return appropriate error messages if limits are exceeded. For current rate limit information, check the [Intigriti API documentation](https://api.intigriti.com/external/researcher/swagger/index.html).

## 🐛 Troubleshooting

### Server Won't Start

- Verify Node.js version: `node --version` (must be ≥18)
- Install dependencies: `npm install`
- Check file permissions: `chmod +x index.js`
- Verify path in Claude Desktop config

### Authentication Fails

- Confirm API token is valid and not expired
- Check token has researcher permissions
- Verify environment variable is set correctly
- Ensure no extra spaces in token value

### API Endpoint Errors

- Intigriti API may have changed - check their documentation
- Some endpoints may require specific permissions
- Contact Intigriti support for API access issues

### Connection Issues

- Check your internet connection
- Verify firewall isn't blocking the connection
- Ensure you can access `api.intigriti.com`

## 📚 Resources

- [Intigriti Platform](https://app.intigriti.com)
- [Intigriti API Documentation](https://api.intigriti.com/external/researcher/swagger/index.html)
- [Intigriti Help Center](https://kb.intigriti.com)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io)

## 🤝 Contributing

Contributions are welcome! Please ensure:

- Code follows existing style and conventions
- New tools include proper descriptions and input schemas
- README is updated with new functionality
- All sensitive data is handled securely
- Tests pass (when implemented)

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This is an **unofficial** MCP server for Intigriti. It is not affiliated with, endorsed by, or officially connected to Intigriti. Use at your own risk and in accordance with Intigriti's terms of service and responsible disclosure policies.

## 💬 Support

- **For MCP Server Issues:** Open an issue on the repository
- **For Intigriti Platform/API Issues:** Contact [Intigriti support](https://support.intigriti.com)
- **For MCP Protocol Questions:** See [MCP documentation](https://modelcontextprotocol.io)

## 🎯 Roadmap

Future enhancements may include:

- [ ] File upload support for attachments
- [ ] Webhook integration
- [ ] Advanced filtering and search
- [ ] Batch operations
- [ ] Caching for improved performance
- [ ] Unit tests and integration tests
- [ ] TypeScript support

---

**Made with ❤️ for the security research community**
