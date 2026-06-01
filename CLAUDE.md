# CLAUDE.md — Phixora

Behavioral guidelines to reduce common LLM coding mistakes.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

---

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

---

## Project: Phixora

Web-based AI image editing tool for non-technical users. Users upload images, apply AI enhancements (super-resolution, denoising, background removal), and download results. AI processing is done via external APIs — no custom ML models in this repo.

### Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React + TypeScript + Vite           |
| Backend  | NestJS + TypeScript                 |
| ORM      | Prisma                              |
| Database | PostgreSQL                          |
| Auth     | Passport.js — JWT + Google OAuth    |
| AI       | External APIs (TBD)                 |

### Repo Structure

```
Phixora_codebase/
├── frontend/          # React + Vite app
│   └── src/
│       ├── pages/     # One file per route (Welcome, Login, Signup, Upload, Tools, Process, History, Result)
│       ├── components/
│       ├── store/     # Zustand stores
│       └── api/       # Axios wrappers for backend calls
└── backend/           # NestJS app
    ├── src/
    │   ├── auth/      # JWT + Google OAuth (Passport strategies, guards)
    │   ├── image/     # Upload endpoint + AI API calls
    │   ├── history/   # CRUD for user history
    │   └── prisma/    # PrismaService (global module)
    └── prisma/
        └── schema.prisma
```

### User Flow (matches wireframes)

1. **Welcome** → marketing page, Login / Sign Up buttons
2. **Sign Up / Login** → email+password or Google OAuth
3. **Upload** → drag-and-drop or file picker (PNG, JPG, JPEG, WEBP)
4. **Tools** → select tool (Super Resolution / Remove Noise / Remove Background), configure params
5. **Process** → loading screen while backend calls AI API
6. **Result (Before/After)** → slider comparison, Export button
7. **History** → list of past operations, click to view result

### Key Rules

- **Auth**: All routes except Welcome, Login, Signup require a valid JWT. Use NestJS `JwtAuthGuard`.
- **Image storage**: Store URLs (not raw files) in the database. Upload to a storage service (TBD), save the URL.
- **AI APIs**: All external AI calls happen in the backend (`image` module). Frontend never calls AI APIs directly.
- **History**: Every successful AI operation is saved to the `History` table automatically.
- **Error handling**: Validate at API boundaries (file type, file size, missing fields). Don't validate internally.

### Running Locally

See README.md.

### Environment Variables

Backend `.env` — copy from `.env.example`:
```
DATABASE_URL=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```
