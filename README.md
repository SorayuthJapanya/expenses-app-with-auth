# EuroCode - Go Expense App

![TypeScript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square)
![NextJs](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

A full-stack personal finance application with a Next.js client and a Go backend. It tracks incomes and expenses, organizes sources, and provides charts and KPIs for quick financial insights.

---

## Features

- **Expense & Income CRUD** - Create, read, update, and delete transactions.
- **Charts & Dashboards** - Generate charts and Visual summaries for expenses and income over time.
- **Authentication** - JWT-based auth for protected API routes.
- **Responsive UI** - Use Next.js + Tailwind-based modern frontend.

---

## Tech Stack

- **Runtime:** Golang + Air
- **Language:** Go + Typescript
- **Frontend:** NextJs + TailwindCss
- **Database & Auth:** MySQL Server + JWT
- **HTTP Client:** Axios/Fetch API
- **CI/CD:** Github Actions (Automated Testing & Deployment)
- **Hosting:** Vercel(Frontend) + Render (Backend)

---

## Repository Structure

- **Client:** [client](client) — Next.js application and UI components.
- **Server:** [server](server) — Go API with `cmd/api` entrypoint, handlers, services, and repositories.

---

## Prerequisites

- Install Go (1.20+ recommended).
- Install Node (18+) and pnpm.
- Run a MySQL server and create a database for the app.

---

## Environment

Create a `.env` file for the server (example keys):

- `DATABASE_DSN` = database dsn for connecting with MySQL Server
- `JWT_SECRET` — secret for signing JWTs

## Local Development

1. Start the database (MySQL).

2. Run the backend API:

```
cd server
go mod download
go run ./cmd/api
```

3. Run the frontend:

```
cd client
pnpm install
pnpm dev
```

The frontend runs on `http://localhost:3000` by default; the API will log its listen address when started.

---

## Build / Production

- **Frontend:** build using `pnpm build` inside `client` and follow your hosting provider instructions for Next.js.
- **Backend:** build a Go binary with `go build -o bin/api ./cmd/api` and run the binary (ensure env variables are set).

---

## API & Internals

- API handlers live in [server/internal/handler](server/internal/handler).
- Database setup and connections are implemented in [server/internal/database/mysql_database.go](server/internal/database/mysql_database.go).

---

## Useful Commands

- Start frontend: `pnpm dev` (in `client`)
- Start backend: `go run ./cmd/api` (in `server`)

---

## Contributing

- Fork the repo, create a feature branch, add tests where appropriate, and open a PR with a clear description.

---

## License
MIT — see the LICENSE file if present.
