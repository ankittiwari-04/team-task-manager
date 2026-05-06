# Contributing to TaskFlow

First off, thank you for considering contributing to TaskFlow! It's people like you that make TaskFlow a great tool.

## Getting Started

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ankittiwari-04/team-task-manager.git
   cd team-task-manager
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your local PostgreSQL connection string
   npm install
   npx prisma generate
   npx prisma migrate dev
   npm run seed
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   # In a new terminal
   cd frontend
   cp .env.example .env
   # Ensure VITE_API_URL points to your local backend (e.g., http://localhost:5000/api)
   npm install
   npm run dev
   ```

## Project Structure

This is a monorepo setup containing both frontend and backend:

- `backend/`: Node.js Express server, Prisma schema, REST controllers, and authentication logic.
- `frontend/`: React Vite application, TailwindCSS styling, components, and TanStack Query state management.
- `.github/`: GitHub Actions workflows and issue/PR templates.
- `scripts/`: Utility scripts for repository management.

## Branching Strategy

- `main`: The production branch. Always stable.
- Feature branches: Use `feature/your-feature-name`
- Bug fixes: Use `fix/bug-description`

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

Examples:
- `feat: add user profile picture upload`
- `fix: resolve issue with drag and drop on Safari`
- `docs: update deployment guide in README`
- `chore: update dependencies`
- `refactor: extract KanbanColumn into separate component`

## Pull Request Process

1. Create a new branch from `main`.
2. Make your changes and commit them using Conventional Commits.
3. Push your branch to GitHub.
4. Open a Pull Request using the provided PR template.
5. Wait for review from maintainers. We may request changes before merging.

## Code Style

- **TypeScript**: We use strict mode. Please ensure no type errors.
- **Linting**: Both frontend and backend use ESLint. Run `npm run lint` before committing.
- **Formatting**: We use Prettier for code formatting.

## Reporting Bugs

If you find a bug, please use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md) to file an issue.

## Code of Conduct

Please be respectful and inclusive. We expect all contributors to maintain a professional and welcoming environment. Harassment of any kind will not be tolerated.
