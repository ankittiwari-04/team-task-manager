#!/bin/bash
set -e

echo "⚠️  WARNING: This script will completely rewrite your Git history!"
echo "It will delete all existing commits and replace them with 7 clean conventional commits."
echo "This is a destructive action."
read -p "Are you absolutely sure you want to continue? (y/n): " confirm

if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
  echo "Aborted."
  exit 1
fi

echo "Creating clean-history branch..."
git checkout --orphan clean-history

echo "Unstaging all files..."
git reset HEAD -- .

echo "Commit 1: Initialize monorepo"
git add .gitignore LICENSE README.md
git commit -m "chore: initialize monorepo with license and root config"

echo "Commit 2: Backend config"
git add backend/package.json backend/tsconfig.json backend/railway.toml backend/Procfile backend/.env.example backend/package-lock.json
git commit -m "chore(backend): add Express + TypeScript + Prisma project config"

echo "Commit 3: Prisma database"
git add backend/prisma/
git commit -m "feat(db): add Prisma schema — 7 models, 3 enums, full relational design"

echo "Commit 4: REST API"
git add backend/src/
git commit -m "feat(api): implement full REST API with auth, projects, tasks, dashboard, notifications"

echo "Commit 5: Frontend config"
# Add everything in frontend EXCEPT src/
git add frontend/index.html frontend/package.json frontend/package-lock.json frontend/tsconfig.json frontend/tsconfig.node.json frontend/vite.config.ts frontend/tailwind.config.js frontend/postcss.config.js frontend/.eslintrc.cjs frontend/.env.example frontend/public/
git commit -m "chore(frontend): add React + Vite + TypeScript + Tailwind project config"

echo "Commit 6: React application"
git add frontend/src/
git commit -m "feat(frontend): implement full React app — Kanban, dashboard, auth, dark mode"

echo "Commit 7: GitHub templates and docs"
git add .github/ CONTRIBUTING.md CHANGELOG.md SECURITY.md scripts/
git commit -m "docs: add GitHub templates, CI workflow, contributing guide, changelog"

echo "Replacing main branch..."
git branch -D main || true
git branch -m main

echo "✅ Success! History rewritten locally."
echo "To push this completely new history to GitHub, run:"
echo "git push -f origin main"
