# Contributing to B.CLEAN

## Important Notice

This is a proprietary, closed-source project. Contributions are limited to authorized team members and contractors with written permission.

## For Authorized Contributors

### Getting Started

1. Ensure you have signed the appropriate NDA and contributor agreement
2. Set up your development environment following the instructions in README.md
3. Familiarize yourself with the codebase structure
4. Review the coding standards below

### Development Workflow

1. **Create a branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

   Branch naming conventions:
   - `feature/` - New features
   - `bugfix/` - Bug fixes
   - `hotfix/` - Critical production fixes
   - `refactor/` - Code refactoring

2. **Make your changes:**
   - Write clean, readable code
   - Follow TypeScript best practices
   - Add comments for complex logic
   - Update documentation as needed

3. **Test thoroughly:**
   - Test on both iOS and Android
   - Verify all affected features
   - Check for console errors/warnings
   - Run type checking: `npm run type-check`
   - Run linting: `npm run lint`

4. **Commit your changes:**

   ```bash
   git add .
   git commit -m "feat: descriptive commit message"
   ```

   Commit message format:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

5. **Push and create pull request:**
   ```bash
   git push origin feature/your-feature-name
   ```

   - Create a detailed pull request description
   - Reference any related issues
   - Request review from team lead

### Coding Standards

#### TypeScript

- Use strict typing - avoid `any` when possible
- Define interfaces for all data structures
- Use enums for fixed sets of values
- Properly type function parameters and return values

#### React Native

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper memoization with useMemo/useCallback
- Follow React Native performance best practices

#### File Organization

- One component per file
- Group related files in folders
- Use index.ts for clean imports
- Keep files under 300 lines when possible

#### Naming Conventions

- Components: PascalCase (e.g., `CustomerCard.tsx`)
- Functions: camelCase (e.g., `getUserData`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
- Interfaces/Types: PascalCase (e.g., `Customer`, `JobStatus`)

#### Comments

- Write self-documenting code when possible
- Add comments for complex business logic
- Document all public APIs
- Include TODO comments for incomplete work
- Use JSDoc for function documentation

### Code Review Process

All code must be reviewed before merging:

1. **Self-review:**
   - Review your own changes first
   - Check for console.log statements
   - Verify no sensitive data is committed
   - Ensure no commented-out code

2. **Peer review:**
   - At least one team member must approve
   - Address all review comments
   - Make requested changes promptly
   - Re-request review after changes

3. **Testing:**
   - QA team tests major features
   - Production-critical code requires additional review
   - Security-sensitive code requires security review

### What NOT to Commit

- Environment files (`.env`)
- API keys or secrets
- Firebase configuration files with real credentials
- Personal certificates or signing keys
- `node_modules/` directory
- Build artifacts (`dist/`, `build/`)
- IDE-specific files
- Debug logs

### Security Guidelines

- Never commit secrets or API keys
- Use environment variables for configuration
- Review Firestore security rules carefully
- Validate all user input
- Sanitize data before displaying
- Follow OWASP mobile security guidelines
- Report security vulnerabilities privately

### Database Changes

Changes to Firestore schema require:

1. Update SCHEMA.md documentation
2. Update TypeScript interfaces
3. Update security rules if needed
4. Plan migration strategy for existing data
5. Get approval from technical lead

### Firebase Deployment

Cloud Functions changes:

1. Test locally with emulators
2. Deploy to staging environment first
3. Monitor logs for errors
4. Get approval before production deployment
5. Have rollback plan ready

### Questions or Issues?

Contact the development team:

- Technical questions: tech@bclean.app
- Access issues: admin@bclean.app

---

## Legal Notice

By contributing to this project, you acknowledge that:

- All contributions become property of B.CLEAN
- You have the right to contribute the code
- Your contributions may be used commercially
- You have read and agree to the terms of the contributor agreement

---

**Thank you for contributing to B.CLEAN!**
