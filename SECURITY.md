# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this MCP server, please report it responsibly:

### DO NOT

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it's been addressed
- Exploit the vulnerability in production environments

### DO

1. **Email the maintainer** with details about the vulnerability
2. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. **Wait for acknowledgment** before public disclosure
4. **Allow reasonable time** for a patch to be developed

## Security Best Practices

### For Users

1. **API Token Security**
   - Never commit API tokens to version control
   - Store tokens in environment variables
   - Use separate tokens for different environments
   - Rotate tokens regularly
   - Revoke tokens when no longer needed

2. **Environment Configuration**
   - Use `.env` files that are excluded from git
   - Restrict file permissions on configuration files
   - Never share your `.env` file

3. **System Security**
   - Keep Node.js and dependencies up to date
   - Use npm audit to check for vulnerabilities
   - Review security advisories regularly

### For Developers

1. **Code Security**
   - Validate all input parameters
   - Sanitize data before API requests
   - Never log sensitive information
   - Use secure communication protocols (HTTPS)

2. **Dependency Management**
   - Keep dependencies up to date
   - Review dependency security advisories
   - Use lock files (package-lock.json)
   - Audit dependencies regularly with `npm audit`

3. **Error Handling**
   - Don't expose sensitive information in error messages
   - Log errors appropriately without revealing secrets
   - Implement proper error boundaries

## Security Updates

Security updates will be released as soon as possible after a vulnerability is confirmed. Users should:

- Watch this repository for security announcements
- Update to the latest version promptly
- Review CHANGELOG.md for security-related updates

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who help improve the security of this project.

## Contact

For security-related inquiries, please contact the project maintainer directly rather than using public channels.
