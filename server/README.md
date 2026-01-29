# Expense App - Server API

Simple Go server for an Expense Tracker API with authentication (JWT cookie/token).

## Overview

This service provides user authentication (register/login) and basic expense CRUD endpoints. It uses MySQL for persistence and Gin for the HTTP server.

## Requirements

- Go 1.20+
- MySQL
- Environment variables configured in the project `config` (see `config/config.go`).

## Quick Setup

1. Configure your `.env`/config with the database DSN.
2. From the project root, run:

```powershell
go run ./cmd/api
```

The server will listen on `:8080` by default.

## Auth

- Registration: `POST /api/auth/register` (accepts JSON with `username`, `email`, `password`).
- Login: `POST /api/auth/login` (accepts JSON with `email`, `password`).

On successful login/register the server returns a JWT token and sets a cookie named `Authorization`. You can send the token either as the `Authorization` cookie or as a `Bearer` token in the `Authorization` header.

## Example Requests

Register (curl):

```bash
curl -X POST http://localhost:8080/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"username":"alice","email":"alice@example.com","password":"secret123"}'
```

Login (curl):

```bash
curl -X POST http://localhost:8080/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"alice@example.com","password":"secret123"}'
```

Authenticated request example (using cookie):

```bash
curl http://localhost:8080/api/expenses \
	--cookie "Authorization=<token>"
```

## Endpoints (examples)

- `POST /api/auth/register` — create user
- `POST /api/auth/login` — login user
- `GET /api/expenses` — list expenses (auth required)
- `POST /api/expenses` — create expense (auth required)

## Notes

- Ensure the database is reachable and migrations/tables are created (the app creates tables on startup).
- For development you can disable Secure cookie flag; for production enable `Secure` and set proper `Domain`.

## License

MIT
