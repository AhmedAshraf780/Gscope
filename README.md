# Gscope

Gym management platform — manage members, sessions, attendance, offers, expenses, and bank with built-in analytics.

## Prerequisites

- **Node.js 20+** (LTS recommended)
- **npm**
- **Redis instance** — local (`docker run -p 6379:6379 redis`) or cloud (Redis Labs, Upstash, etc.)
- **Gmail account** with an [App Password](https://support.google.com/accounts/answer/185833) for sending OTP emails

## Getting Started

```bash
# 1. Clone the repository
git clone <repo-url> Gscope
cd Gscope

# 2. Set up environment variables
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your own credentials:

| Variable | Description |
|----------|-------------|
| `PORT` | Backend port (default `6969`) |
| `MAIL_USER` | Gmail address for sending OTPs |
| `MAIL_PASSWORD` | Gmail app password |
| `JWT_SECRET` | Random string for signing JWT tokens |
| `REDIS_USERNAME` | Redis username (usually `default`) |
| `REDIS_PASSWORD` | Redis password |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port |
| `AUTH_TOKEN` | Cookie name for the JWT (default `auth-token`) |

```bash
# 3. Install and start the backend
cd backend
npm install
npm run dev
# → http://localhost:6969
# Swagger docs: http://localhost:6969/api-docs
# Monitor: http://localhost:6969/monitor

# 4. In a new terminal, install and start the frontend
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

The SQLite database is created and migrated automatically when the backend starts. No manual DB setup needed.

## Architecture

```
Gscope/
├── backend/          Express + TypeScript + SQLite + Redis
│   ├── src/
│   │   ├── controllers/    Request handlers
│   │   ├── database/       SQLite (via sqlite3) + migrations
│   │   ├── middlewares/     Auth (JWT), SSE monitoring
│   │   ├── routes/         All API route definitions
│   │   ├── config/         Env config, nodemailer, Redis, Swagger
│   │   ├── utils/          OTP generation & email
│   │   └── tests/          Jest test suite
├── frontend/         React 19 + Vite + TypeScript + Tailwind
│   └── src/
│       ├── pages/          Dashboard, auth, landing pages
│       ├── services/       API client services
│       ├── auth/           Auth context, storage, hooks
│       └── components/     Shared UI components
└── shared/           Shared TypeScript types
```

## Scripts

### Backend

| Script | Command |
|--------|---------|
| `npm run dev` | Start with hot-reload (nodemon) |
| `npm run build` | Compile TypeScript |
| `npm test` | Run test suite |
| `npm run format` | Format with Prettier |

### Frontend

| Script | Command |
|--------|---------|
| `npm run dev` | Vite dev server (HMR) |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, GSAP
- **Backend:** Express 5, TypeScript, SQLite (sqlite3), Redis, JWT, Nodemailer
- **Testing:** Jest, Supertest
