# Quick Start Guide

Get up and running with Intigriti MCP Server in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

Or use the setup script:

```bash
chmod +x setup.sh
./setup.sh
```

### 2. Get Your API Token

1. Visit [Intigriti](https://app.intigriti.com)
2. Go to Settings → API
3. Generate a new token
4. Copy the token

### 3. Configure

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your token:

```
INTIGRITI_API_TOKEN=your_actual_token_here
```

### 4. Add to Claude Desktop

Edit your Claude Desktop config:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add this (replace the path):

```json
{
  "mcpServers": {
    "intigriti": {
      "command": "node",
      "args": ["/full/path/to/intigriti-mcp-server/index.js"],
      "env": {
        "INTIGRITI_API_TOKEN": "your_actual_token_here"
      }
    }
  }
}
```

### 5. Restart Claude Desktop

Close and reopen Claude Desktop completely.

## ✅ Verify It's Working

In Claude, try:

```
"List all available bug bounty programs on Intigriti"
```

If you see program data, you're all set! 🎉

## 🆘 Troubleshooting

### Server Not Showing Up

- Check the path in config is absolute (no `~` or `.`)
- Verify `index.js` is executable: `chmod +x index.js`
- Check Claude Desktop logs for errors

### Authentication Error

- Verify token is correct (no extra spaces)
- Ensure token has researcher permissions
- Check token hasn't expired

### No Programs Returned

- Confirm you have access to at least one program
- Check your Intigriti account status
- Verify API token permissions

## 📚 Next Steps

- Read the [full README](README.md) for detailed documentation
- Check [available tools](README.md#-available-tools) for all capabilities
- Review [security best practices](SECURITY.md)

## 💡 Example Queries

```
"Show me program details for [program-id]"
"List my open submissions"
"What's my researcher acceptance rate?"
"Get the scope for the XYZ program"
```

Happy bug hunting! 🐛🎯
