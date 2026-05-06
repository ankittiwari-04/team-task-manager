# Security Policy

## Supported Versions

We take security seriously. Currently, only the latest major release is actively supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Please **DO NOT** open a public issue on GitHub to report a security vulnerability. 

Instead, please email the maintainer directly at **your-email@example.com**. Include detailed steps to reproduce the vulnerability. You should expect a response within 48 hours acknowledging the issue. We will work with you to patch the vulnerability and release an update as quickly as possible.

## Security Best Practices for Self-Hosting

If you are self-hosting TaskFlow, please ensure you follow these best practices:
- **Change JWT Secrets**: Always use a strong, unique, and securely generated string for your `JWT_SECRET`.
- **Strong Database Password**: Ensure your PostgreSQL database uses a strong password and is not exposed publicly.
- **Production Environment**: Ensure your backend runs with `NODE_ENV=production`.
- **Dependency Updates**: Regularly update your Node.js dependencies using `npm audit` and `npm update` to patch known vulnerabilities.
