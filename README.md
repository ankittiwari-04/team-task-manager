# TaskFlow — Team Task Manager

> A full-stack project management application with Kanban boards, role-based access control, real-time notifications, and an analytics dashboard.

![TypeScript](https://img.shields.io/badge/TypeScript-96%25-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-336791?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

## 🔗 Live Demo

| Service | URL |
|---------|-----|
| Frontend | [Add your Vercel URL here after deployment] |
| Backend API | [Add your Railway URL here after deployment] |

**Demo Credentials**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | Admin123! |
| Member | sarah@demo.com | Member123! |
| Member | james@demo.com | Member123! |

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login/register with access + refresh tokens, bcrypt password hashing
- 👥 **Role-Based Access Control** — Admin and Member roles with granular per-project permissions
- 📁 **Project Management** — Create projects, invite team members by email, set due dates and color labels, archive projects
- 🗂 **Kanban Board** — Full drag-and-drop task management across TODO → IN PROGRESS → IN REVIEW → DONE (react-beautiful-dnd)
- ✅ **Task System** — Priority levels (Urgent/High/Medium/Low), assignees, due dates, tags, comments, activity logs
- 📊 **Analytics Dashboard** — Task completion trend chart (last 30 days), stat cards, overdue tracking, recent activity feed
- 🔔 **Notifications** — 30-second polling with unread count badge, mark-as-read, per-notification delete
- 🌙 **Dark Mode** — System preference detection + manual toggle, persisted in localStorage
- 🛡 **Admin Panel** — User management, all-project overview, role promotion/demotion
- 📋 **List View** — Sortable/filterable task table with bulk actions and CSV export
- 📝 **Activity Logs** — Per-project and per-task audit trail with user attribution
- 📱 **Responsive Design** — Mobile-friendly layout with collapsible sidebar

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| TypeScript | Type-safe backend code |
| PostgreSQL | Relational database |
| Prisma ORM | Database access, migrations, type generation |
| JSON Web Tokens | Stateless authentication (access + refresh) |
| Bcrypt (rounds: 12) | Secure password hashing |
| Zod | Runtime request schema validation |
| Helmet + CORS | Security headers and origin control |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 + Vite | UI framework and lightning-fast build tool |
| TypeScript | Type-safe frontend code |
| TailwindCSS | Utility-first styling with dark mode |
| TanStack Query v5 | Server state, caching, background refetch |
| Zustand | Lightweight client state (theme, sidebar) |
| React Beautiful DnD | Accessible drag-and-drop Kanban |
| Recharts | Composable analytics charts |
| React Hook Form + Zod | Performant form handling with validation |
| React Hot Toast | Elegant toast notifications |
| date-fns | Lightweight date formatting utilities |
| lucide-react | Consistent icon library |

---

## 🗂 Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handler logic (auth, projects, tasks, dashboard, notifications, users)
│   │   ├── middleware/       # JWT authentication, role guards, error handler
│   │   ├── routes/           # Express router definitions
│   │   ├── services/         # Notification creation + activity logging service
│   │   └── utils/            # JWT helpers, Prisma client singleton
│   ├── prisma/
│   │   ├── schema.prisma     # Full database schema (7 models, 3 enums)
│   │   └── seed.ts           # Demo data: 3 users, 2 projects, 8 tasks, activity logs
│   ├── .env.example          # Environment variable template
│   ├── railway.toml          # Railway deployment config (build + start commands)
│   ├── Procfile              # Process file for Railway
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios client + typed API function wrappers
│   │   ├── components/
│   │   │   ├── common/       # AvatarGroup, PriorityBadge, StatusBadge, ConfirmDialog, EmptyState
│   │   │   ├── layout/       # AppLayout, Sidebar, Topbar with notifications
│   │   │   ├── projects/     # ProjectCard, ProjectFormModal, MembersTab
│   │   │   └── tasks/        # KanbanBoard, KanbanCard, TaskListView, TaskFormModal
│   │   ├── context/          # React auth context (login, register, logout, updateUser)
│   │   ├── hooks/            # TanStack Query hooks for all resources
│   │   ├── pages/            # Dashboard, Projects, ProjectDetail, TaskDetail, Profile, Admin
│   │   ├── store/            # Zustand store (theme, sidebar collapsed, selected project)
│   │   └── types/            # TypeScript interfaces and enums
│   ├── .env.example
│   ├── vercel.json           # Vercel SPA rewrite config
│   └── tailwind.config.js
└── README.md
```

---

## ⚙️ Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL running locally (or use a free cloud DB like [Neon](https://neon.tech))

### 1. Clone the repo
```bash
git clone https://github.com/ankittiwari-04/team-task-manager.git
cd team-task-manager
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your values:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/taskmgr
JWT_SECRET=your-secret-min-64-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-64-chars
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
# ✅ API running at http://localhost:5000
```

### 3. Frontend setup
```bash
cd ../frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
# ✅ App running at http://localhost:5173
```

### 4. Login
Navigate to `http://localhost:5173` and log in with:
- **Admin:** `admin@demo.com` / `Admin123!`
- **Member:** `sarah@demo.com` / `Member123!`

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | Login, returns JWT + refresh token | No |
| POST | `/api/auth/refresh-token` | Issue new access token | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update name/avatar | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |

### Projects
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects` | List user's projects (with task counts + progress) | Yes |
| POST | `/api/projects` | Create project | Admin |
| GET | `/api/projects/:id` | Project detail with members + activity | Yes |
| PUT | `/api/projects/:id` | Update project | Admin |
| DELETE | `/api/projects/:id` | Delete project (cascade) | Admin |
| PATCH | `/api/projects/:id/archive` | Toggle archive status | Admin |
| GET | `/api/projects/:id/members` | List project members | Yes |
| POST | `/api/projects/:id/members` | Add member by email | Admin |
| DELETE | `/api/projects/:id/members/:userId` | Remove member | Admin |
| PATCH | `/api/projects/:id/members/:userId/role` | Update member role | Admin |

### Tasks
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | List tasks (filter: projectId, status, priority, assigneeId, search, overdue, page, limit) | Yes |
| POST | `/api/tasks` | Create task | Yes |
| GET | `/api/tasks/overdue` | All overdue tasks across user's projects | Yes |
| GET | `/api/tasks/:id` | Task detail with comments + activity | Yes |
| PUT | `/api/tasks/:id` | Update task (logs field changes) | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Creator/Admin |
| PATCH | `/api/tasks/:id/status` | Update status + position (drag-drop) | Yes |
| POST | `/api/tasks/bulk-update` | Bulk status update | Admin |
| GET | `/api/tasks/:id/comments` | Get task comments | Yes |
| POST | `/api/tasks/:id/comments` | Add comment | Yes |
| DELETE | `/api/tasks/:taskId/comments/:commentId` | Delete comment | Author/Admin |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Full dashboard stats (charts, activity, summaries) |
| GET | `/api/notifications` | Paginated notifications with unread count |
| PATCH | `/api/notifications/read` | Mark all notifications as read |
| PATCH | `/api/notifications/:id/read` | Mark single notification as read |
| DELETE | `/api/notifications/:id` | Delete notification |
| GET | `/api/users` | All users (Admin only) |
| GET | `/api/users/search?q=` | Search users by name or email |

---

## 🚀 Deployment

### Backend → Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
2. Select this repo, set **Root Directory** to `backend`
3. Add a PostgreSQL database: **+ New** → **Database** → **Add PostgreSQL**
4. Set environment variables on the backend service:

```env
DATABASE_URL        # Copy from the PostgreSQL service "Connect" tab
JWT_SECRET          # Run: openssl rand -hex 64
JWT_REFRESH_SECRET  # Run: openssl rand -hex 64
FRONTEND_URL        # Your Vercel URL (add after step below)
NODE_ENV            # production
```

5. Railway automatically runs `railway.toml` build command which installs, generates Prisma client, runs migrations, and builds TypeScript
6. Copy the generated Railway URL (e.g. `https://your-app.up.railway.app`)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import GitHub repo
2. Set **Root Directory** to `frontend`, Framework Preset: **Vite**
3. Add environment variable:
   ```
   VITE_API_URL = https://your-railway-url.up.railway.app/api
   ```
4. Deploy and copy your Vercel URL
5. Go back to Railway → update `FRONTEND_URL` to your Vercel URL → redeploy backend

### Environment Variable Summary

| Variable | Where | Description |
|----------|-------|-------------|
| `DATABASE_URL` | Railway | PostgreSQL connection string |
| `JWT_SECRET` | Railway | Min 64 char random string |
| `JWT_REFRESH_SECRET` | Railway | Min 64 char random string |
| `FRONTEND_URL` | Railway | Your Vercel app URL |
| `NODE_ENV` | Railway | `production` |
| `VITE_API_URL` | Vercel | Your Railway API URL + `/api` |

---

## 🗃 Database Schema

```
User ──< ProjectMember >── Project ──< Task ──< Comment
                                         │
                                         └──< ActivityLog
User ──< Notification
User ──< ActivityLog
```

Key design decisions:
- `ProjectMember` join table allows per-project role assignment independent of global role
- `Task.tags` stored as `String[]` (PostgreSQL array) for simplicity
- `ActivityLog.details` stored as `Json?` for flexible change tracking
- All relations use cascade deletes where appropriate

---

## 🔒 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT secrets loaded from environment — never hardcoded
- All API routes protected with `authenticate` middleware
- Role checks enforced at both middleware and controller level
- Input validation with Zod on all POST/PUT endpoints
- Helmet.js for security headers
- CORS restricted to `FRONTEND_URL` origin

---

## 📄 License

MIT — feel free to use this project as a reference or starting point.

---

*Built with React, Node.js, PostgreSQL, and TypeScript*
