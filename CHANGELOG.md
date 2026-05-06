# Changelog

All notable changes to TaskFlow will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2025-05-01

### Added
- Full monorepo structure with backend and frontend packages
- JWT authentication with access and refresh tokens
- Role-based access control with Admin and Member roles
- Project management: create, update, archive, delete with color labels
- Team member management: invite by email, assign roles, remove members
- Kanban board with drag-and-drop using react-beautiful-dnd
- Task system: priorities, assignees, due dates, tags, comments
- Analytics dashboard with 30-day completion trend chart (Recharts)
- Real-time-style notifications with 30-second polling
- Dark mode with system preference detection and localStorage persistence
- Admin panel: user management, all-project overview, role promotion
- Task list view with sorting, filtering, bulk actions, and CSV export
- Activity logs per project and per task
- Prisma ORM with PostgreSQL: 7 models, 3 enums, cascade deletes
- Database seed with 3 demo users, 2 projects, 8 tasks
- Railway deployment config (backend) and Vercel config (frontend)
- GitHub Actions CI: backend build, frontend build, lint check
- MIT License
