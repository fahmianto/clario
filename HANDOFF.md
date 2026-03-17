# 🚀 CLARIO — Project Handoff Guide

> **Untuk siapapun yang melanjutkan project ini.** Baca dulu sebelum mulai coding.

---

## 📌 Info Utama

| Item | Detail |
|---|---|
| **Nama Project** | CLARIO — Academic Platform |
| **Repository** | https://github.com/fahmianto/clario |
| **Branch Utama** | `main` |
| **Phase Terakhir** | Phase 7 (Completed) |
| **Next Phase** | Phase 8 — AI Features & User Profile |

---

## 🗂️ Struktur Folder

```
clario/
├── clario-app/          # Main React + Vite app
│   ├── src/
│   │   ├── components/  # Shared UI components (Header, Sidebar, dll)
│   │   ├── context/     # AuthContext, LanguageContext
│   │   ├── pages/       # Halaman per role: author/, reviewer/, admin/, qa/
│   │   ├── services/    # Firebase services (article, user, notification, dll)
│   │   └── hooks/       # Custom hooks
│   ├── .env             # ⚠️ Buat manual — tidak ada di GitHub!
│   └── vite.config.js   # Port: 5173
└── APP_REQUIREMENTS.md  # Spesifikasi lengkap dari awal
```

---

## 🔐 Environment Variables (Wajib dibuat ulang!)

Buat file `clario-app/.env` dengan isi berikut:

```env
# Firebase (dari Firebase Console Project clario-*)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# AI Provider (gemini / openai / claude)
VITE_AI_PROVIDER=gemini
VITE_GEMINI_API_KEY=
VITE_OPENAI_API_KEY=
VITE_CLAUDE_API_KEY=
```

---

## ▶️ Cara Menjalankan

```bash
# 1. Clone repo
git clone https://github.com/fahmianto/clario.git
cd clario/clario-app

# 2. Install dependencies
npm install

# 3. Buat file .env (lihat section di atas)

# 4. Jalankan dev server (port 5173)
npm run dev
```

---

## ✅ Fitur yang Sudah Selesai

| Phase | Fitur |
|---|---|
| 1-3 | Landing page, Auth Firebase (email/password), routing per role |
| 4 | Reviewer Workspace — split-screen, 10 framework komponen, AI tools |
| 5 | QA Dashboard, screening queue, approval flow |
| 6 | Header search, AI service (Gemini/OpenAI/Claude), PDF export, revisi naskah |
| 7 | Admin Assignments (real data), Notification bell (real-time), Recharts analytics, Multilingual ID/EN |

---

## 🔥 Yang Belum / Next Steps (Phase 8+)

- [ ] **User Profile Page** — edit foto, bio, institusi
- [ ] **Auto-Assign AI** — button di AdminAssignments masih placeholder
- [ ] **AI Similarity Checker** — deteksi kemiripan antar naskah
- [ ] **Deploy** — ke Vercel atau Firebase Hosting
- [ ] **Firestore Security Rules** — perlu dikencengin

---

## 🏗️ Arsitektur

- **Frontend**: React + Vite (port 5173)
- **Backend/DB**: Firebase Firestore
- **Auth**: Firebase Authentication
- **AI**: Gemini (default), OpenAI, Claude (via `.env`)
- **Charts**: Recharts
- **Styling**: Tailwind CSS

---

## 💬 Cara Lanjutkan di Antigravity Baru

Cukup bilang ke Antigravity:
> *"Lanjutkan project Clario dari GitHub: https://github.com/fahmianto/clario — sudah di Phase 7, next adalah Phase 8 (User Profile, Auto-Assign AI, Deploy). Baca HANDOFF.md dulu."*
