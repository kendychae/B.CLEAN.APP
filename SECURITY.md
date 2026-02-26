# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

**DO NOT** report security vulnerabilities through public GitHub issues.

If you discover a security vulnerability within B.CLEAN, please send an email to:

**security@bclean.app**

Include the following information:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue

### What to Expect

- Acknowledgment of your report within 48 hours
- Regular updates on our progress
- Credit for discovery (if desired) when vulnerability is announced
- Notification when the vulnerability is fixed

### Disclosure Policy

- Give us reasonable time to fix the issue before public disclosure
- We aim to fix critical vulnerabilities within 7 days
- We will coordinate public disclosure timing with you

## Security Best Practices

### For Users

- Keep the app updated to the latest version
- Use strong passwords for your account
- Enable device security (passcode/biometric)
- Do not share your login credentials
- Report suspicious activity immediately

### For Developers

- Follow secure coding guidelines in CONTRIBUTING.md
- Never commit secrets or API keys
- Use environment variables for sensitive configuration
- Review Firestore security rules before deployment
- Implement proper input validation
- Follow principle of least privilege

## Known Security Considerations

### Authentication

- Firebase Authentication provides secure user management
- Passwords are never stored in plain text
- Session tokens expire automatically

### Data Storage

- All data encrypted in transit (HTTPS/TLS)
- Firestore provides encryption at rest
- Sensitive data should never be logged

### Payment Processing

- All payment processing through Stripe
- No credit card data stored in our systems
- PCI compliance handled by Stripe

### Permissions

- Location access only when app is in use
- Camera access only when taking photos
- Calendar access only when syncing jobs
- All permissions can be revoked by user

## Compliance

### Data Privacy

- GDPR considerations for European users
- CCPA considerations for California users
- Users can request data deletion
- Privacy policy available in app

### Mobile Security

- Follows OWASP Mobile Security guidelines
- Regular security audits recommended
- Penetration testing before major releases

## Security Checklist for Releases

Before each release:

- [ ] Update all dependencies
- [ ] Review Firebase security rules
- [ ] Audit API key restrictions
- [ ] Check for hardcoded secrets
- [ ] Test authentication flows
- [ ] Verify permission boundaries
- [ ] Review error messages (no sensitive data)
- [ ] Test on multiple devices
- [ ] Scan for vulnerabilities
- [ ] Update security documentation

## Contact

For security concerns:
**Email:** security@bclean.app

For general issues:
**Email:** support@bclean.app

---

**Last Updated:** February 2026
