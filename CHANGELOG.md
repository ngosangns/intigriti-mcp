# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-03-19

### Added
- Initial release of Intigriti MCP Server
- Program management tools:
  - List all available programs
  - Get detailed program information
  - View program scope (in-scope and out-of-scope assets)
- Submission management tools:
  - List submissions with filtering by program, status, and limit
  - Get detailed submission information
  - Create new bug submissions
  - Add comments to existing submissions
- Researcher statistics tool
- Comprehensive error handling
- Bearer token authentication
- README with full documentation
- Example configuration files
- MIT License
- Contributing guidelines

### Security
- Secure API token handling via environment variables
- No hardcoded credentials in source code
- Proper .gitignore to prevent accidental token commits

## [Unreleased]

### Planned
- File upload support for attachments
- Webhook integration
- Advanced filtering and search capabilities
- Batch operations
- Response caching
- Unit and integration tests
- TypeScript support
- CLI tool for standalone usage
