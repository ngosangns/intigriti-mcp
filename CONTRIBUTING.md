# Contributing to Intigriti MCP Server

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (Node version, OS, etc.)
- Error messages or logs

### Suggesting Features

Feature requests are welcome! Please open an issue with:
- Clear description of the feature
- Use case and motivation
- Example usage if applicable

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test your changes thoroughly
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Code Guidelines

### Style

- Use ES6+ JavaScript features
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic

### Tools

- Maintain consistent error handling
- Add proper input validation
- Include descriptive error messages
- Follow MCP protocol specifications

### Documentation

- Update README.md for new features
- Add JSDoc comments for functions
- Include usage examples
- Update CHANGELOG if present

## Testing

Currently, the project doesn't have automated tests. When adding features:
- Test manually with Claude Desktop
- Verify all tools work as expected
- Check error handling paths
- Test with invalid inputs

## Security

- Never commit API tokens or secrets
- Review code for security vulnerabilities
- Follow principle of least privilege
- Report security issues privately

## Questions?

Feel free to open an issue for any questions about contributing!
