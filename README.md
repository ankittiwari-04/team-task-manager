# TaskFlow — Team Task Manager

Monorepo with:
- `backend`: Express + TypeScript + Prisma + PostgreSQL
- `frontend`: React + Vite + TypeScript + React Query + Zustand + Tailwind

## Demo Credentials
- Admin: `admin@demo.com / Admin123!`
- Member: `sarah@demo.com / Member123!`

## Local Setup

### Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Deployment
- Backend: Railway (`backend/railway.toml`, `backend/Procfile`)
- Frontend: Vercel (`frontend/vercel.json`)
