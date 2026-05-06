<div align="center">
  <br/>
  <h1>🚀 TaskFlow</h1>
  <p><strong>Production-grade Team Task Manager — Built to impress</strong></p>
  
  <p>
    React · TypeScript · Node.js · PostgreSQL · Prisma · TailwindCSS
  </p>
  
  <p>
    <a href="https://github.com/ankittiwari-04/team-task-manager/actions"><img src="https://img.shields.io/github/actions/workflow/status/ankittiwari-04/team-task-manager/ci.yml?branch=main&style=flat-square" alt="CI Status" /></a>
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="MIT License" />
  </p>

  <p>
    <a href="#-live-demo">Live Demo</a> ·
    <a href="#-quick-start">Quick Start</a> ·
    <a href="#-features">Features</a> ·
    <a href="#-api-reference">API Docs</a> ·
    <a href="#-deployment-guide">Deploy Guide</a>
  </p>
</div>

<br/>

## 🚀 Live Demo

<table>
  <tr>
    <td><strong>Frontend (Vercel)</strong></td>
    <td><a href="https://frontend-ankit-tiwaris-projects-9e5e5260.vercel.app">https://frontend-ankit-tiwaris-projects-9e5e5260.vercel.app</a></td>
  </tr>
  <tr>
    <td><strong>Backend API (Render)</strong></td>
    <td><a href="https://team-task-manager-u6vx.onrender.com/health">https://team-task-manager-u6vx.onrender.com/health</a></td>
  </tr>
</table>

### Demo Credentials

| Role | Email | Password | What you can do |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@demo.com` | `password123` | Create projects, manage all users, bulk actions, admin panel |
| **Member** | `sarah@demo.com` | `password123` | Join projects, manage tasks, add comments, view dashboard |

*(Note: The login page has convenient "Demo Login" buttons so you don't even need to type these!)*

<br/>

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h3>🔐 Auth & Security</h3>
      <p>JWT, bcrypt 12 rounds, RBAC, Helmet, Zod</p>
    </td>
    <td width="50%">
      <h3>📁 Project Management</h3>
      <p>CRUD, color labels, due dates, archive, member invites</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🗂️ Kanban Board</h3>
      <p>react-beautiful-dnd, 4 columns, optimistic updates, tag filter</p>
    </td>
    <td width="50%">
      <h3>📊 Analytics Dashboard</h3>
      <p>Recharts AreaChart, 30-day trend, stat cards, activity feed</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🔔 Notifications</h3>
      <p>30s polling, unread badge, mark read, click-to-navigate</p>
    </td>
    <td width="50%">
      <h3>🎨 UI/UX</h3>
      <p>Dark mode, skeleton loaders, responsive, toast notifications, keyboard shortcuts</p>
    </td>
  </tr>
</table>

<br/>

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| <img src="https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white" /> | 18.x | Runtime |
| <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" /> | 4.x | Web Framework |
| <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" /> | 5.x | Static Typing |
| <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" /> | 15.x | Primary Database |
| <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" /> | 5.x | Next-gen ORM |
| <img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" /> | 9.x | Authentication |
| <img src="https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white" /> | 3.x | Schema Validation |

### Frontend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" /> | 18.x | UI Library |
| <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" /> | 5.x | Build Tool |
| <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" /> | 5.x | Static Typing |
| <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" /> | 3.x | Utility Styling |
| <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white" /> | 5.x | Data Fetching & Caching |
| <img src="https://img.shields.io/badge/Zustand-000000?style=flat-square" /> | 4.x | Global State |
| <img src="https://img.shields.io/badge/react--beautiful--dnd-0052CC?style=flat-square" /> | 13.x | Kanban Drag & Drop |

<br/>

## 🏗️ Architecture & Structure

```
team-task-manager/
├── backend/                  # Node.js API
│   ├── prisma/               # Database schema & migrations
│   │   ├── schema.prisma     # 7 models, 3 enums
│   │   └── seed.ts           # Demo data generator
│   └── src/
│       ├── controllers/      # Route logic
│       ├── middleware/       # Auth, error, validation guards
│       ├── routes/           # API endpoint definitions
│       └── utils/            # JWT, password hashing
├── frontend/                 # React App
│   ├── src/
│   │   ├── components/       # Reusable UI (Board, Modals, Charts)
│   │   ├── hooks/            # TanStack Query custom hooks
│   │   ├── pages/            # View components (Dashboard, Kanban)
│   │   └── store/            # Zustand state (Auth, UI theme)
└── .github/                  # CI/CD, Issue/PR Templates
```

### Database Entity-Relationship Diagram

```
User ──< ProjectMember >── Project ──< Task ──< Comment
 │                                      │
 ├──< Notification                      └──< ActivityLog
 └──< ActivityLog
```

### Key Design Decisions
1. **Monorepo Structure**: Simplifies full-stack deployment and allows sharing of TypeScript types (in the future) while keeping backend and frontend dependencies isolated.
2. **TanStack Query + Zustand**: TanStack handles asynchronous server state (caching, optimistic updates for the Kanban board) while Zustand manages synchronous client state (dark mode, mobile sidebar toggles).
3. **Role-Based Access Control (RBAC)**: Implemented at the Prisma model level (ProjectMember role) and enforced globally via Express middleware before requests hit the controllers.

<br/>

## 🏁 Quick Start

### 1. Prerequisites
- Node.js v18+
- PostgreSQL (Local or managed via [Neon.tech](https://neon.tech))

### 2. Clone the repository
```bash
git clone https://github.com/ankittiwari-04/team-task-manager.git
cd team-task-manager
```

### 3. Backend Setup
```bash
cd backend
cp .env.example .env
```
| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing tokens |
| `PORT` | API port (default: 5000) |

```bash
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

### 4. Frontend Setup
```bash
# In a new terminal
cd ../frontend
cp .env.example .env
```
| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Backend URL (e.g. `http://localhost:5000/api`) |

```bash
npm install
npm run dev
```

### 5. Access the app
Open `http://localhost:5173` and click the **Demo Manager** button to log in!

<br/>

## 📖 API Reference

### Authentication
| Method | Endpoint | Description | Auth Req |
| :--- | :--- | :--- | :--- |
| <img src="https://img.shields.io/badge/POST-000000?style=flat-square&logo=postman&logoColor=white" /> | `/api/auth/register` | Create a new user account | No |
| <img src="https://img.shields.io/badge/POST-000000?style=flat-square&logo=postman&logoColor=white" /> | `/api/auth/login` | Authenticate user and return JWT | No |
| <img src="https://img.shields.io/badge/GET-000000?style=flat-square&logo=postman&logoColor=white" /> | `/api/auth/me` | Get current authenticated user | Yes |

### Projects
| Method | Endpoint | Description | Auth Req |
| :--- | :--- | :--- | :--- |
| <img src="https://img.shields.io/badge/GET-000000?style=flat-square&logo=postman&logoColor=white" /> | `/api/projects` | List projects user belongs to | Yes |
| <img src="https://img.shields.io/badge/POST-000000?style=flat-square&logo=postman&logoColor=white" /> | `/api/projects` | Create a new project (Admin only) | Yes |
| <img src="https://img.shields.io/badge/GET-000000?style=flat-square&logo=postman&logoColor=white" /> | `/api/projects/:id` | Get project details, members, tasks | Yes |
| <img src="https://img.shields.io/badge/PUT-000000?style=flat-square&logo=postman&logoColor=white" /> | `/api/projects/:id` | Update project details | Yes |
| <img src="https://img.shields.io/badge/DELETE-000000?style=flat-square&logo=postman&logoColor=white" /> | `/api/projects/:id` | Delete project | Yes |
| <img src="https://img.shields.io/badge/POST-000000?style=flat-square&logo=postman&logoColor=white" /> | `/api/projects/:id/members` | Invite user to project by email | Yes |

### Tasks
| Method | Endpoint | Description | Auth Req |
| :--- | :--- | :--- | :--- |
| <img src="https://img.shields.io/badge/GET-000000?style=flat-square&logo=postman&logoColor=white" /> | `/api/tasks` | Get all tasks assigned to user | Yes |
| <img src="https://img.shields.io/badge/POST-000000?style=flat-square&logo=postman&logoColor=white" /> | `/api/tasks` | Create a new task in a project | Yes |
| <img src="https://img.shields.io/badge/PUT-000000?style=flat-square&logo=postman&logoColor=white" /> | `/api/tasks/:id` | Update task details | Yes |
| <img src="https://img.shields.io/badge/PATCH-000000?style=flat-square&logo=postman&logoColor=white" /> | `/api/tasks/:id/status` | Move task to a different Kanban column | Yes |
| <img src="https://img.shields.io/badge/DELETE-000000?style=flat-square&logo=postman&logoColor=white" /> | `/api/tasks/:id` | Delete task | Yes |

### Dashboard & Logs
| Method | Endpoint | Description | Auth Req |
| :--- | :--- | :--- | :--- |
| <img src="https://img.shields.io/badge/GET-000000?style=flat-square&logo=postman&logoColor=white" /> | `/api/dashboard/stats` | Get aggregate task metrics and trends | Yes |
| <img src="https://img.shields.io/badge/GET-000000?style=flat-square&logo=postman&logoColor=white" /> | `/api/notifications` | Get unread notifications | Yes |
| <img src="https://img.shields.io/badge/PATCH-000000?style=flat-square&logo=postman&logoColor=white" /> | `/api/notifications/:id/read` | Mark notification as read | Yes |

<br/>

## 🌐 Deployment Guide

### 1. Render (Backend)
1. Push your code to GitHub.
2. Go to [Render](https://render.com) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the Root Directory to `backend`.
5. Build Command: `npm install && npx prisma generate && npm run build`
6. Start Command: `npm start`
7. Add Environment Variables: `DATABASE_URL` and `JWT_SECRET`.
8. Deploy!

### 2. Vercel (Frontend)
1. Go to [Vercel](https://vercel.com) and create a new Project.
2. Connect the same GitHub repository.
3. Set the Root Directory to `frontend`.
4. Add Environment Variable: `VITE_API_URL` pointing to your Render backend URL (e.g. `https://team-task-manager.onrender.com/api`).
5. Deploy!

<br/>

## 🗄️ Database Schema

The database uses PostgreSQL managed by Prisma ORM. It contains 7 models:

- **`User`**: Core authentication model containing `id`, `email`, `password`, `name`, `avatar`, and `role`.
- **`Project`**: High-level container for work containing `name`, `description`, `color`, `dueDate`, and `isArchived`.
- **`ProjectMember`**: A join table mapping Users to Projects with specific access roles (`ADMIN` or `MEMBER`).
- **`Task`**: The core unit of work belonging to a Project. Contains `title`, `description`, `status` (Enum), `priority` (Enum), `dueDate`, and PostgreSQL String arrays for `tags`.
- **`Comment`**: Threaded discussion attached to Tasks.
- **`ActivityLog`**: Immutable audit trails created automatically on task movements and project updates.
- **`Notification`**: Alert records dispatched when users are assigned tasks or invited to projects.

<br/>

## 🛡️ Security

This project implements the following security measures:
- **Authentication**: Stateless JWT strategy.
- **Password Hashing**: Bcrypt with 12 rounds of salting.
- **Validation**: Strict schema validation using Zod on both client and server boundaries to prevent NoSQL injection and malformed payloads.
- **Protection**: Helmet middleware applied for secure HTTP headers.
- **CORS**: Strictly configured Cross-Origin Resource Sharing.
- **RBAC**: Multi-layered Role-Based Access Control ensuring Members cannot invoke Admin mutation endpoints.

<br/>

## 🤝 Contributing
Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) to learn how to set up your environment, follow our branching strategy, and submit Pull Requests.

<br/>

## 📄 License
This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <br/>
  <p>Built with ❤️ using React, Node.js, PostgreSQL and TypeScript</p>
  <p>⭐ Star this repo if you found it useful!</p>
</div>
