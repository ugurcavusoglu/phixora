# Phixora

Web-based AI image editing tool. Upload an image, apply AI enhancements (super-resolution, noise removal, background removal), download the result.

**Stack:** React + TypeScript + Vite · NestJS · Prisma · PostgreSQL (Docker) · Passport (JWT + Google OAuth) · Real-ESRGAN · GFPGAN

---

## Prerequisites

- Node.js 20+
- Docker Desktop
- Python 3.8+ with pip

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
PORT=3000
UPLOAD_DIR=uploads
OUTPUT_DIR=outputs
MAX_UPLOAD_MB=10
PYTHON_PATH=python
```

Google OAuth kullanmak istersen `GOOGLE_CLIENT_ID` ve `GOOGLE_CLIENT_SECRET` değerlerini de doldur (zorunlu değil, email/şifre ile giriş çalışır).

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

### 6. AI model ağırlıklarını indir

Model dosyaları GitHub'a yüklenmez (boyut çok büyük). Aşağıdaki script otomatik olarak indirir:

```bash
cd backend/ai
python download_models.py
```

Toplam ~480 MB indirilir. İndirme tamamlanınca `backend/ai/Real-ESRGAN/experiments/pretrained_models/` klasöründe şu dosyalar olacak:
- `RealESRGAN_x4plus.pth` (4x upscale)
- `RealESRGAN_x2plus.pth` (2x upscale)
- `GFPGANv1.3.pth` (face enhancement)

### 7. Python AI bağımlılıklarını kur

```bash
pip install realesrgan gfpgan "numpy<2" opencv-python torch torchvision
```

> **Not:** Kurulum birkaç dakika sürebilir. GPU'n varsa otomatik olarak kullanılır, yoksa CPU ile çalışır (4x upscale yaklaşık 2-3 dakika sürer).

Kurulumu test etmek için:

```bash
python -c "from realesrgan import RealESRGANer; print('OK')"
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

- Super Resolution (4x, CPU) işlemi **2-3 dakika** sürebilir, bu normaldir.
- İşlenen resimler `backend/outputs/` klasörüne kaydedilir.
- Yüklenen orijinal resimler `backend/uploads/` klasörüne kaydedilir.
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
    │   ├── image/            # Upload + AI processing
    │   ├── history/          # Geçmiş işlemler CRUD
    │   ├── contact/          # İletişim formu endpoint
    │   └── prisma/           # PrismaService
    ├── ai/
    │   ├── Real-ESRGAN/      # xinntao/Real-ESRGAN (git clone)
    │   └── scripts/          # super_resolution.py, remove_noise.py,
    │                         # remove_background.py
    └── prisma/
        └── schema.prisma
```

---

## Group

CENG318 — Group 10
- Ugur Mert Cavusoglu — Backend
- Samet Buldanlioglu — AI Integration & Backend
- Furkan Orhan — Backend
- Melike Dogru — Frontend
