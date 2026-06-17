# EduBridge 🎓

> AI-Powered Student Resource & Collaboration Ecosystem — MERN Stack

One centralized platform replacing fragmented WhatsApp groups, Telegram groups, and Google Drive links for college students.

---

## 🚀 Features

| Module | Features |
|--------|----------|
| **Resources** | Upload/download Notes, PYQs, Assignments, Lab Manuals, Placement Material |
| **Book Exchange** | Buy/sell/give textbooks with reservation & chat |
| **Project Teams** | Post projects, find teammates via AI matching |
| **Mentorship** | Book 1-on-1 sessions with seniors, rating system |
| **Opportunities** | Hackathons, internships, scholarships, placement drives |
| **Real-time Chat** | Socket.io powered DMs with typing indicators |
| **AI Tools** | Career advisor, resume analyzer, smart search, duplicate detection |
| **Notifications** | In-app + push notifications via Firebase FCM |
| **Admin Panel** | Stats, college approvals, role management |
| **Dark Mode** | Full dark mode support |

---

## 🛠️ Tech Stack

**Frontend:** React 18, TailwindCSS, Redux Toolkit, React Query, Socket.io Client  
**Backend:** Node.js, Express.js, Socket.io, Multer  
**Database:** MongoDB Atlas  
**File Storage:** Cloudinary  
**AI:** OpenAI GPT-3.5 / Gemini  
**Push Notifications:** Firebase Cloud Messaging  
**Auth:** JWT + Google OAuth  
**Deployment:** Frontend → Vercel, Backend → Render

---

## 📁 Project Structure

```
edubridge/
├── backend/
│   ├── config/           # DB, Cloudinary, Firebase configs
│   ├── controllers/      # Route handlers
│   ├── middleware/        # Auth, upload, error handler
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routers
│   ├── services/         # AI, Email, Notification services
│   ├── sockets/          # Socket.io handlers
│   ├── utils/            # Seed script
│   ├── server.js         # Entry point
│   ├── .env.example
│   └── render.yaml       # Render deployment config
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI components
    │   │   ├── common/   # Skeleton, Badge, Modal, etc.
    │   │   ├── layout/   # MainLayout, AuthLayout
    │   │   ├── resources/
    │   │   ├── projects/
    │   │   ├── auth/
    │   │   └── ...
    │   ├── pages/        # Route pages
    │   ├── store/        # Redux store + slices
    │   ├── hooks/        # Custom hooks
    │   ├── services/     # API, Socket, Firebase
    │   └── styles/       # Global CSS
    ├── vercel.json
    └── .env.example
```

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Fill in your .env values

# Frontend
cd ../frontend
npm install
cp .env.example .env
# Fill in your .env values
```

### 2. Seed the Database

```bash
cd backend
node utils/seed.js
```

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# Runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# Runs on http://localhost:3000
```

---

## 🔑 Required API Keys

| Service | Purpose | Get it from |
|---------|---------|-------------|
| MongoDB Atlas | Database | [atlas.mongodb.com](https://atlas.mongodb.com) |
| Cloudinary | File storage | [cloudinary.com](https://cloudinary.com) |
| OpenAI | AI features | [platform.openai.com](https://platform.openai.com) |
| Google OAuth | Social login | [console.cloud.google.com](https://console.cloud.google.com) |
| Firebase | Push notifications | [console.firebase.google.com](https://console.firebase.google.com) |
| Gmail SMTP | OTP emails | App password from Google account |

---

## 🚢 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Push to GitHub → Import to Vercel → Set env vars → Deploy
```

### Backend → Render
```bash
# Push backend to GitHub
# Import to Render → Use render.yaml → Set env vars → Deploy
```

---

## 👥 Roles

| Role | Permissions |
|------|-------------|
| `student` | Upload resources, join projects, book mentorship, chat |
| `senior_mentor` | All student permissions + create mentorship slots |
| `college_admin` | Admin panel with college-level stats |
| `university_admin` | Approve colleges, manage users |
| `super_admin` | Full platform control, role assignment |

---

## 🤖 AI Features

- **Resource Recommendations** — Personalized based on skills, semester, branch
- **Team Matching** — Suggests best teammates for a project
- **Duplicate Detection** — Prevents re-uploading same resources
- **Career Advisor** — Suggests career paths from your skill set
- **Resume Analyzer** — ATS score, skill gaps, improvement suggestions
- **Smart Search** — Natural language → structured search query

---

## 📞 Support

For issues or feature requests, open a GitHub issue or reach out via the platform's chat system.

---

*Built with ❤️ for students, by students.*
