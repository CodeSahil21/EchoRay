# EchoRay

A collaborative, AI-powered project management and code generation platform. Build, chat, and code together—faster than ever.

[![GitHub Stars](https://img.shields.io/github/stars/CodeSahil21/EchoRay?style=social)](https://github.com/CodeSahil21/EchoRay.git)
[![GitHub Forks](https://img.shields.io/github/forks/CodeSahil21/EchoRay?style=social)](https://github.com/CodeSahil21/EchoRay.git/fork)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](#license)

---

## 📑 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Client](#running-the-client)
  - [Running the Server](#running-the-server)
  - [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- **User Authentication** (JWT)
- **Project Management**: Create, update, delete, and collaborate on projects
- **Real-time Collaboration**: Add/remove users, chat, and share code
- **File Tree Management**: Edit and organize project files visually
- **AI Code Assistant**: Generate code, get answers, and automate tasks with AI
- **Live Preview**: Instantly preview your code output
- **RESTful API**: Well-documented endpoints for all actions

---

## 🛠 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (React, TypeScript, TailwindCSS)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Prisma ORM](https://www.prisma.io/)
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: JWT, Cookies
- **AI Integration**: Custom AI agent (OpenAI/Google Generative AI)
- **Real-time**: Socket.io
- **Other**: Redux, GSAP, Monaco Editor, React Toastify

---

## 📁 Folder Structure

```
EchoRay/
│
├── client/         # Next.js frontend
│   ├── app/
│   ├── components/
│   ├── config/
│   ├── public/
│   ├── store/
│   ├── package.json
│   └── ...
│
├── server/         # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── prisma/
│   ├── package.json
│   └── ...
│
├── README.md
└── ...
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (or your preferred DB)

### Installation

Clone the repository:

```sh
git clone https://github.com/CodeSahil21/EchoRay.git
cd EchoRay
```

Install dependencies for both client and server:

```sh
cd client
npm install
cd ../server
npm install
```

### Running the Client

```sh
cd client
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

### Running the Server

```sh
cd server
npm run dev
```
Server runs on [http://localhost:5000](http://localhost:5000) (or your configured port)

### Environment Variables

Create `.env` files in both `client/` and `server/` directories.  
Example for `server/.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/echoray
JWT_SECRET=your_jwt_secret
AI_API_KEY=your_ai_api_key
```

---

## 📖 API Documentation

See [server/README.md](server/README.md) for full API docs.

**Main Endpoints:**

- **User:** Register, Login, Profile, Logout, Get All Users
- **Project:** Create, Get All, Add/Remove Users, Delete, Update File Tree
- **AI:** `/api/v1/ai/get-result?prompt=...` — Get AI-generated code or answers

Example AI usage:

```http
GET /api/v1/ai/get-result?prompt=Write%20a%20hello%20world%20program%20in%20Python
```

---

## ☁️ Deployment

- **Frontend:** Deploy on [Vercel](https://vercel.com/)
- **Backend:** Deploy on [Render](https://render.com/), [Railway](https://railway.app/), or your preferred cloud
- **Database:** Use managed PostgreSQL (Supabase, Neon, etc.)

---

## 🤝 Contributing

Contributions are welcome!  
Star ⭐ the repo and [fork it](https://github.com/CodeSahil21/EchoRay.git/fork) to submit pull requests.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

> If you like EchoRay, please ⭐ star the repo and share your