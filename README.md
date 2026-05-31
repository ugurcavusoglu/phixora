# Phixora

Web-based AI image editing tool. Upload an image, apply AI enhancements (super-resolution, noise removal, background removal), download the result.

**Stack:** React + TypeScript + Vite · NestJS · Prisma · PostgreSQL (Docker) · Passport (JWT + Google OAuth)

---

## Prerequisites

- Node.js 20+
- Docker Desktop

## Setup

### 1. Clone and install

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
# .env.example already has working defaults for local Docker setup
# Optionally fill in GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET for Google OAuth
```

### 3. Start the database

```bash
# From project root
docker compose up -d
```

> PostgreSQL runs on port **5433** (to avoid conflicts with any local PostgreSQL on 5432).

### 4. Run migrations

```bash
cd backend
npx prisma migrate dev --name init
```

### 5. Run

```bash
# Backend (port 3000)
cd backend
npm run build && node dist/src/main.js

# Frontend (port 5173) — separate terminal
cd frontend
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:3000

---

## Notes

- Google OAuth requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`. Email/password auth works without it.
- AI processing is stubbed — the backend returns the original image. Replace the stub in `backend/src/image/image.service.ts` with a real API call.

---

## Project Structure

```
Phixora_codebase/
├── docker-compose.yml   # PostgreSQL on port 5433
├── frontend/
│   └── src/
│       ├── pages/       # WelcomePage, LoginPage, SignupPage, UploadPage, ToolsPage, ProcessPage, ResultPage, HistoryPage, ProfilePage
│       ├── components/  # Navbar, ProtectedRoute
│       ├── store/       # authStore (Zustand), imageStore (Zustand)
│       └── api/         # auth.ts, image.ts, history.ts, client.ts
└── backend/
    ├── src/
    │   ├── auth/        # JWT + Google OAuth, guards, strategies
    │   ├── image/       # Upload + AI stub
    │   ├── history/     # CRUD
    │   └── prisma/      # PrismaService
    └── prisma/
        └── schema.prisma
```

## Group

CENG318 — Group 10  
- Ugur Mert Cavusoglu — Backend  
- Samet Buldanlioglu — AI Integration & Backend  
- Furkan Orhan — Backend  
- Melike Dogru — Frontend
