# TaskFlow: Team Task Manager

A professional, full-stack web application for creating projects, assigning tasks, and tracking team progress. Inspired by industry-leading project management platforms like **Jira** and **Linear**, TaskFlow delivers a premium "Deep Slate & Indigo" SaaS aesthetic with rich interactive features.

## 🚀 Live Demo
**Frontend (Vercel):** [https://frontend-8l467nhye-ankit-tiwaris-projects-9e5e5260.vercel.app](https://frontend-8l467nhye-ankit-tiwaris-projects-9e5e5260.vercel.app)
**Backend (Render):** [https://team-task-manager-u6vx.onrender.com/health](https://team-task-manager-u6vx.onrender.com/health)

## ✅ Assignment Requirements Checklist

This project was built strictly to satisfy the assignment requirements:

- [x] **Authentication (Signup/Login):** Fully secure JWT-based authentication system with robust Zod input validation and human-readable error handling.
- [x] **Project & Team Management:** Users can create projects, update descriptions, and manage team members. 
- [x] **Role-Based Access Control (Admin/Member):**
  - **Admins:** Can create projects, edit project details, manage users, and assign roles. A visual `ADMIN` badge is displayed in the navigation header.
  - **Members:** Can view assigned projects, create tasks, and update task statuses via drag-and-drop.
- [x] **Task Creation, Assignment & Status Tracking:** Fully featured task management with priorities, due dates, tags, and assignees.
- [x] **Dashboard:** Comprehensive high-level overview featuring active tasks, completed tasks, overdue items, and dynamic charts (Recharts).
- [x] **REST APIs + Database:** A strict RESTful Express.js backend connected to a PostgreSQL database using Prisma ORM. Includes full validation, cascading deletes, and complex relationships.
- [x] **Deployment:** Frontend is deployed to Vercel. Backend is deployed to Render (Railway alternative). The app is fully live and functional.

## ✨ Jira-Inspired Interactive Features

To elevate the experience beyond a standard assignment, several premium interactions were added:
1. **Interactive Kanban Boards:** Fully functional drag-and-drop task pipelines built with `react-beautiful-dnd`. Drag tasks between "To Do", "In Progress", "In Review", and "Done" just like Jira.
2. **Activity Timelines:** A global activity logging system tracks every action (e.g., "Alex Admin created Website Redesign") and displays it in a timeline on the project detail page.
3. **Glassmorphism UI:** Built with TailwindCSS and Framer Motion, the entire interface uses modern translucent glass cards, smooth page transitions, and hover micro-animations.

## 🛠 Tech Stack
- **Frontend:** React, Vite, TailwindCSS, Zustand, React-Query, Framer Motion, React-Beautiful-DnD
- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL, Zod, JWT

## 📦 Database Seeding Instructions

The backend contains a built-in seeding script to instantly populate the database with demo users, projects, and tasks to make reviewing the application easier.

If you are running the project locally, run:
```bash
cd backend
npm run db:generate
npx prisma db seed
```

**Demo Credentials (Available after seeding):**
- **Admin User:** `admin@demo.com` / `Admin123!`
- **Member User:** `sarah@demo.com` / `Member123!`

If testing on the live production URL without seeding, simply click **"Create one now"** on the login page to register a fresh account.
