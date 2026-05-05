#!/bin/bash

# ============================================================
# Git History Rewrite Script
# Replaces the single "initial commit" with meaningful commits
# WARNING: This rewrites git history. Only run BEFORE sharing
# the repo URL with anyone, or force-push after.
# Usage: bash scripts/rewrite-git-history.sh
# ============================================================

set -e

echo "⚠️  This will rewrite your git history."
echo "Make sure you have no uncommitted changes first."
read -p "Continue? (y/N): " confirm
if [[ "$confirm" != "y" ]]; then
  echo "Aborted."
  exit 0
fi

# Step 1: Unstage everything back to untracked state
echo ""
echo "📦 Resetting to empty history..."
git checkout --orphan clean-history
git reset HEAD -- .

# Step 2: Commit in logical chunks

echo "📦 Commit 1/6 — Project scaffold and config..."
git add .gitignore README.md
git add backend/.env.example backend/package.json backend/tsconfig.json backend/railway.toml backend/Procfile
git add frontend/.env.example frontend/package.json frontend/tsconfig.json frontend/tsconfig.app.json frontend/tsconfig.node.json
git add frontend/vite.config.ts frontend/tailwind.config.js frontend/postcss.config.js frontend/vercel.json frontend/eslint.config.js frontend/index.html
git commit -m "chore: initialize monorepo structure and config files

- Backend: Express + TypeScript + Prisma setup
- Frontend: React 18 + Vite + TypeScript + Tailwind setup
- Deployment configs: Railway (backend) and Vercel (frontend)
- Root gitignore covering node_modules, dist, .env files"

echo "📦 Commit 2/6 — Database schema and seed..."
git add backend/prisma/
git commit -m "feat(db): add Prisma schema with full relational model

Models: User, Project, ProjectMember, Task, Comment, ActivityLog, Notification
Enums: Role (ADMIN/MEMBER), TaskStatus (4 states), TaskPriority (4 levels)
Relations: cascade deletes, optional assignments, activity tracking
Seed: 3 demo users (1 admin + 2 members), 2 projects, 8 tasks with varied statuses"

echo "📦 Commit 3/6 — Backend API implementation..."
git add backend/src/
git commit -m "feat(api): implement full REST API

Auth: register, login, refresh token, profile update, password change
Projects: CRUD, archive, member management (add/remove/role update)
Tasks: CRUD, drag-drop status update, bulk update, overdue query
Comments: add, list, delete with author check
Dashboard: stats, completion chart (30d), top members (admin)
Notifications: paginated list, mark read, delete
Middleware: JWT authenticate, requireAdmin, requireProjectAccess
Validation: Zod schemas on all POST/PUT endpoints
Security: bcrypt (12 rounds), Helmet, CORS origin guard"

echo "📦 Commit 4/6 — Frontend foundation..."
git add frontend/src/api/
git add frontend/src/types/
git add frontend/src/context/
git add frontend/src/store/
git add frontend/src/hooks/useDebounce.ts
git commit -m "feat(frontend): add API client, types, auth context, and store

API: typed wrappers for all backend endpoints (auth, projects, tasks, dashboard, notifications, users)
Types: full TypeScript interfaces for all domain models + enums
AuthContext: login/register/logout/updateUser with JWT token management
Zustand store: theme (dark/light with persistence), sidebar collapse state
Debounce hook: generic with configurable delay"

echo "📦 Commit 5/6 — React Query hooks and common components..."
git add frontend/src/hooks/
git add frontend/src/components/common/
git add frontend/src/main.tsx
git add frontend/src/App.tsx
git commit -m "feat(frontend): add React Query hooks and reusable components

Hooks: useProjects, useTasks, useDashboard, useNotifications with React Query v5
Components: AvatarGroup, PriorityBadge, StatusBadge, ConfirmDialog, EmptyState, LoadingSpinner, DarkModeToggle
Routing: protected/public route wrappers, all page routes defined
Query setup: QueryClientProvider, invalidation strategies, optimistic updates for drag-drop"

echo "📦 Commit 6/6 — Pages, layout, and feature components..."
git add frontend/src/
git commit -m "feat(frontend): implement all pages and feature components

Layout: AppLayout with collapsible sidebar (icons + nav), Topbar with notification bell + user dropdown
Dashboard: stats cards, Recharts AreaChart (30d completion), activity feed, tasks by status
Projects: ProjectCard with progress bar + member avatars, ProjectFormModal with color picker
Kanban: drag-and-drop board (react-beautiful-dnd), 4 columns, tag filtering, add task
Task List: sortable/filterable table, bulk actions, CSV export
Task Detail: inline editing, comments, activity log, sidebar metadata
Members: invite by email, role management, remove with confirmation
Profile: edit profile + change password forms
Admin: users table, projects overview
Dark mode: Tailwind dark: variants, persisted preference"

# Step 3: Replace main branch
echo ""
echo "🔁 Replacing main branch..."
git branch -D main 2>/dev/null || true
git branch -m main

echo ""
echo "✅ History rewritten with 6 clean commits."
echo ""
echo "To push to GitHub:"
echo "  git push origin main --force"
echo ""
echo "⚠️  This is a force push — it rewrites remote history."
echo "Only do this if you are the sole contributor."
