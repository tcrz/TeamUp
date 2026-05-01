# TeamUp

A simple, free, open-source project management tool. Teams can create projects, manage tasks, assign members, track progress, and comment.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript (Vite) |
| Styling | Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT |
| Monorepo | pnpm workspaces |

## Project Structure

```
teamup/
├── apps/
│   ├── web/          # React + Vite frontend
│   └── api/          # Express backend
├── packages/
│   └── shared/       # Shared TypeScript types
├── package.json
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Docker (for the database)

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the database:
   ```bash
   docker run --name teamup-db \
     -e POSTGRES_USER=teamup \
     -e POSTGRES_PASSWORD=teamup \
     -e POSTGRES_DB=teamup \
     -p 5432:5432 \
     -v teamup-db-data:/var/lib/postgresql/data \
     -d postgres:16
   ```

3. Set up environment variables in `apps/api/.env`:
   ```
   PORT=3001
   DATABASE_URL="postgresql://teamup:teamup@localhost:5432/teamup"
   JWT_SECRET=your-super-secret-key
   JWT_EXPIRES_IN=7d
   ```

4. Run database migrations:
   ```bash
   cd apps/api
   npx prisma migrate dev
   ```

5. Start the API:
   ```bash
   cd apps/api
   pnpm dev
   ```

6. Start the frontend:
   ```bash
   cd apps/web
   pnpm dev
   ```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
