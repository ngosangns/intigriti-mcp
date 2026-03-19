# Intigriti MCP Server

A Model Context Protocol (MCP) server for interacting with the Intigriti bug bounty platform's Researcher API. This enables AI assistants like Claude to help security researchers manage their bug bounty programs, submissions, and research workflow.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Features

This MCP server provides comprehensive tools for interacting with Intigriti:

### 📋 Program Management
- **List Programs** - View all available bug bounty programs
- **Get Program Details** - Access detailed program information
- **View Scope** - See in-scope and out-of-scope assets

### 🐛 Submission Management
- **List Submissions** - View your bug submissions with advanced filtering
- **Get Submission Details** - Access full submission information
- **Create Submissions** - Submit new bug reports
- **Add Comments** - Update submissions with additional information

### 📊 Researcher Analytics
- **Get Stats** - View your performance metrics and earnings

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

### Managing Submissions

```
"List all my open bug submissions"
"Show me my accepted bugs from this month"
"Get details about submission abc-123-def"
"What's the status of my recent submissions?"
```

### Submitting Bugs

```
"I found an XSS vulnerability in the XYZ program. Help me submit it."
"Create a new submission for [program] about [vulnerability type]"
"Add a comment to submission [id] with additional reproduction steps"
```

### Viewing Statistics

```
"Show me my researcher statistics"
"What's my acceptance rate on Intigriti?"
"How many submissions have I made this year?"
```

## 🛠️ Available Tools

### 1. intigriti_list_programs

Lists all bug bounty programs available to you as a researcher.

**Parameters:** None

**Returns:** Array of programs with name, company, status, and reward information

**Example:**
```
List all available programs
```

### 2. intigriti_get_program

Gets detailed information about a specific program.

**Parameters:**
- `program_id` (string, required) - Program identifier

**Returns:** Full program details including policy, rewards, response targets

**Example:**
```
Get details about program abc123
```

### 3. intigriti_get_program_scope

Retrieves the structured scope for a program.

**Parameters:**
- `program_id` (string, required) - Program identifier

**Returns:** In-scope and out-of-scope assets

**Example:**
```
What's the scope for program xyz789?
```

### 4. intigriti_list_submissions

Lists your bug submissions with optional filtering.

**Parameters:**
- `program_id` (string, optional) - Filter by program
- `status` (string, optional) - Filter by status: `open`, `closed`, `accepted`, `duplicate`, `na`, `informative`
- `limit` (number, optional) - Max results (default: 50)

**Returns:** Array of submissions

**Example:**
```
Show me all my accepted submissions
List open submissions for program abc123
```

### 5. intigriti_get_submission

Gets detailed information about a specific submission.

**Parameters:**
- `submission_id` (string, required) - Submission UUID

**Returns:** Full submission details with communication history

**Example:**
```
Get details about submission 12345-abcd-6789
```

### 6. intigriti_create_submission

Submits a new bug report to a program.

**Parameters:**
- `program_id` (string, required) - Target program
- `title` (string, required) - Brief vulnerability title
- `description` (string, required) - Detailed description
- `severity` (string, required) - `critical`, `high`, `medium`, `low`, `none`
- `proof_of_concept` (string, required) - Reproduction steps
- `endpoint` (string, required) - Affected URL/endpoint
- `vulnerability_type` (string, optional) - Type of vulnerability

**Returns:** Created submission details

**Example:**
```
Create a new XSS submission for program xyz with title "Reflected XSS in search parameter"
```

### 7. intigriti_add_submission_comment

Adds a comment to an existing submission.

**Parameters:**
- `submission_id` (string, required) - Submission UUID
- `comment` (string, required) - Comment text

**Returns:** Updated submission

**Example:**
```
Add comment "Additional proof of concept attached" to submission 12345
```

### 8. intigriti_get_researcher_stats

Retrieves your researcher statistics.

**Parameters:** None

**Returns:** Stats including total submissions, acceptance rate, reputation, earnings

**Example:**
```
Show me my researcher statistics
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
