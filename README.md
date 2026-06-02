# Phixora

Web-based AI image editing tool. Upload an image, apply AI enhancements (super-resolution, noise removal, background removal), download the result.

**Stack:** React + TypeScript + Vite · NestJS · Prisma · PostgreSQL (Docker) · Passport (JWT + Google OAuth) · Replicate API

---

## Prerequisites

- Node.js 20+
- Docker Desktop
- A [Replicate](https://replicate.com/account/api-tokens) API token (for AI processing)

---

## Setup

### 1. Clone the repo

```bash
git clone <repo-url>
cd phixora
```

### 2. Install Node dependencies

```bash
# Backend
cd backend
npm install

# Frontend (open a new terminal)
cd frontend
npm install
```

### 3. Configure environment

```bash
cd backend
cp .env.example .env
```

`.env` dosyasını aç ve şu değerleri düzenle:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/phixora
JWT_SECRET=your-secret-key-here
REPLICATE_API_TOKEN=r8_your_token_here
UPLOAD_DIR=uploads
OUTPUT_DIR=outputs
MAX_UPLOAD_MB=10
```

- `REPLICATE_API_TOKEN`: https://replicate.com/account/api-tokens adresinden alınır. AI işlemleri için zorunlu.
- Google OAuth kullanmak istersen `GOOGLE_CLIENT_ID` ve `GOOGLE_CLIENT_SECRET` değerlerini de doldur (zorunlu değil, email/şifre ile giriş çalışır).

### 4. Veritabanını başlat

```bash
# Proje kökünden (docker-compose.yml'ın bulunduğu yer)
docker compose up -d
```

PostgreSQL **5433** portunda çalışır.

### 5. Prisma migration çalıştır

```bash
cd backend
npx prisma migrate dev --name init
```

---

## Çalıştırma

Her biri **ayrı bir terminalde** açılmalı:

**Terminal 1 — Backend:**
```bash
cd backend
npm run start:dev
```
Backend: http://localhost:3000

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Frontend: http://localhost:5173

**Terminal 3 — Veritabanı (ilk seferden sonra arka planda çalışır):**
```bash
docker compose up -d
```

---

## Önemli Notlar

- AI işlemleri Replicate API üzerinden yapılır (super-resolution & denoise: Real-ESRGAN, background removal: rembg). Kendi modelimiz/ağırlığımız yok.
- İşlenen resimler `backend/outputs/`, yüklenen orijinaller `backend/uploads/` klasörüne kaydedilir.
- Google OAuth `GOOGLE_CLIENT_ID` ve `GOOGLE_CLIENT_SECRET` olmadan çalışmaz, ama email/şifre girişi her durumda çalışır.

---

## Proje Yapısı

```
phixora/
├── docker-compose.yml        # PostgreSQL (port 5433)
├── frontend/
│   └── src/
│       ├── pages/            # WelcomePage, LoginPage, SignupPage, UploadPage,
│       │                     # ToolsPage, ProcessPage, ResultPage, HistoryPage,
│       │                     # FeaturesPage, TutorialPage, ContactPage
│       ├── components/       # Navbar, ProtectedRoute
│       ├── store/            # authStore, imageStore (Zustand)
│       └── api/              # auth.ts, image.ts, history.ts, client.ts
└── backend/
    ├── src/
    │   ├── auth/             # JWT + Google OAuth, guards, strategies
    │   ├── image/            # Upload + Replicate AI processing
    │   ├── history/          # Geçmiş işlemler CRUD
    │   ├── contact/          # İletişim formu endpoint
    │   └── prisma/           # PrismaService
    └── prisma/
        └── schema.prisma
```

## Group

CENG318 — Group 10
- Ugur Mert Cavusoglu — Backend
- Samet Buldanlioglu — AI Integration & Backend
- Furkan Orhan — Backend
- Melike Dogru — Frontend
