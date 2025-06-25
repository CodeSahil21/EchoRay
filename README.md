# 🚀 EchoRay — AI-Powered Real-Time Code Collaboration Platform

**EchoRay** is a next-generation, AI-powered collaborative project management and code generation platform.  
Build, chat, and code **together** in real-time—with seamless project control, live editing, and instant AI assistance—all inside a blazing-fast and modern UI.

[![GitHub Stars](https://img.shields.io/github/stars/CodeSahil21/EchoRay?style=social)](https://github.com/CodeSahil21/EchoRay)
[![GitHub Forks](https://img.shields.io/github/forks/CodeSahil21/EchoRay?style=social)](https://github.com/CodeSahil21/EchoRay/fork)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](#-license)

---

## 📚 Table of Contents

- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Folder Structure](#-folder-structure)
- [🚀 Getting Started](#-getting-started)
  - [⚙️ Prerequisites](#️-prerequisites)
  - [📦 Installation](#-installation)
  - [▶️ Running the Client](#️-running-the-client)
  - [▶️ Running the Server](#️-running-the-server)
  - [🔐 Environment Variables](#-environment-variables)
- [📖 API Documentation](#-api-documentation)
- [🌐 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

- 🔧 **Project Management** – Secure CRUD with access restrictions for leaders.
- 👨‍💻 **Live Code Collaboration** – Real-time file editing via Socket.io.
- 💬 **Built-in Chat** – Real-time project-based chat rooms.
- 🤖 **AI Code Assistant** – Generate code, debug, or automate tasks with integrated OpenAI/Google AI.
- 🧠 **Monaco Code Editor + File Tree** – True developer experience with visual organization.
- 🔐 **Role-Based Access** – Granular permissions for each project member.
- 🧪 **Live Output Preview** – See your code in action instantly.
- ✅ **Secure Auth** – JWT + Cookie-based authentication.
- 🔄 **Redis Integration** – High-speed caching and real-time support.
- 🌈 **Modern UI/UX** – TailwindCSS, GSAP animations, and responsive Next.js components.

---

## 🛠 Tech Stack

**Frontend:**
- `Next.js` (React + TypeScript)
- `TailwindCSS`, `GSAP`, `Redux`, `Monaco Editor`, `Toastify`

**Backend:**
- `Node.js`, `Express.js`
- `Prisma ORM`, `Redis`, `Socket.io`

**Database & Auth:**
- `PostgreSQL`, `JWT`, `Cookies`

**AI:**
- OpenAI / Google Generative AI (Custom Wrapper)

---

## 📁 Folder Structure

```
EchoRay/
│
├── client/             # Frontend (Next.js)
│   ├── app/            # Routes and pages
│   │   ├── home/       # Dashboard
│   │   ├── signin/     # Sign-in page
│   │   ├── signup/     # Sign-up page
│   │   ├── logout/     # Logout route
│   │   └── project/[id]/  # Dynamic project view
│   ├── components/     # UI components (ChatBox, CodeEditor, etc.)
│   ├── config/         # WebSockets, AI setup
│   ├── public/         # Static assets
│   ├── store/          # Redux store
│   └── ...
│
├── server/             # Backend (Express.js)
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── db/           # DB connection
│   │   ├── middlewares/  # Auth, error handling
│   │   ├── routes/       # Route definitions
│   │   ├── services/     # Core logic (AI, project, user)
│   │   └── utils/        # Helpers & types
│   ├── prisma/           # Prisma schema & migrations
│   └── ...
│
├── README.md
└── ...
```

---

## 🚀 Getting Started

### ⚙️ Prerequisites

- Node.js `v18+`
- PostgreSQL
- Redis
- npm / yarn

### 📦 Installation

```bash
git clone https://github.com/CodeSahil21/EchoRay.git
cd EchoRay
```

Install dependencies:

```bash
cd client && npm install
cd ../server && npm install
```

---

### ▶️ Running the Client

```bash
cd client
npm run dev
```
➡️ Visit: [http://localhost:3000](http://localhost:3000)

---

### ▶️ Running the Server

```bash
cd server
npm run dev
```
➡️ Visit: [http://localhost:5000](http://localhost:5000)

---

### 🔐 Environment Variables

Create `.env` in both `client/` and `server/`.

#### Example `server/.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/echoray
JWT_SECRET=your_jwt_secret
AI_API_KEY=your_ai_api_key
REDIS_URL=redis://localhost:6379
```

---

## 📖 API Documentation

Check [server/README.md](server/README.md) for detailed API docs.

### 🔑 Core Endpoints

| Feature   | Endpoint Example |
|-----------|------------------|
| User      | `/api/v1/user/register`, `/login`, `/logout`, `/profile` |
| Project   | `/api/v1/project/create`, `/add-collaborator`, `/delete` |
| AI        | `/api/v1/ai/get-result?prompt=Your+question+here` |
| Chat      | Real-time via `Socket.io`

> Example:
```http
GET /api/v1/ai/get-result?prompt=Hello%20World%20in%20Python
```

---

## 🌐 Deployment

- **Frontend:** [Vercel](https://vercel.com/)
- **Backend:** [Render](https://render.com/), [Railway](https://railway.app/)
- **DB:** [Supabase](https://supabase.com/), [Neon](https://neon.tech/)
- **Redis:** [Upstash](https://upstash.com/), [Redis Cloud](https://redis.com/redis-enterprise-cloud/)

---

## 🤝 Contributing

We ❤️ contributions!

```bash
# Fork the repo
# Create a new branch
git checkout -b feature/YourFeature
# Commit and push
git commit -m "Added New Feature"
git push origin feature/YourFeature
```

Open a PR and let’s build EchoRay together!

---

## 📄 License

Released under the [MIT License](LICENSE).

---

> ⚡ **EchoRay** is your gateway to collaborative, AI-powered software creation. Build faster. Build smarter. Together.  
