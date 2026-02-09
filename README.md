# Student Management API (NestJS + MongoDB Atlas)

A standalone NestJS API with clean architecture style modules, JWT access/refresh tokens, RBAC, and Scalar API documentation.

## API URL

- Base URL (local): `http://localhost:8080`
- Scalar docs: `http://localhost:8080/api-reference`

## Core Standards Implemented

- No session/cookie auth
- Access + Refresh token authentication
- RBAC using `Roles` + `RolesGuard`
- Every API response follows:
  - `status`
  - `message`
  - `data`
- Centralized error handling with consistent error JSON
- JSON-only request and response payloads

## Environment Variables

| Variable | Example | Purpose |
|---|---|---|
| `PORT` | `8080` | App port |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas connection string |
| `TOKEN_SECRET` | `TxXfXQ1sDSZrIhNCrcCy0i60yxUI6yPqoyUs2AUsJX1egpZucoOq4HcQ6YU3G88Z9lS8wA3r` | Access token signing secret |
| `REFRESH_TOKEN_SECRET` | `R5Mqw5GzBBoKgM0QAYZD_Kp3WDBrDGi2HZTM5vRhQz7wNye5rKv5BrbiSoyWGu_kKfoZJfQq` | Refresh token signing secret |
| `JWT_EXPIRY` | `1d` | Access token expiry |
| `REFRESH_JWT_EXPIRY` | `365d` | Refresh token expiry |
| `DEFAULT_ADMIN_NAME` | `System Admin` | Seeded admin name |
| `DEFAULT_ADMIN_EMAIL` | `admin@example.com` | Seeded admin email |
| `DEFAULT_ADMIN_PASSWORD` | `ChangeMe123!` | Seeded admin password |

## Local Setup

```bash
npm install
cp .env.example .env
npm run start:dev
```

## Docker Setup (Docker Compose)

```bash
cp .env.example .env
docker compose up --build -d
```

Useful commands:

```bash
docker compose logs -f api
docker compose down
```

## Admin Seeding

On app startup:

- If `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD` are set, an admin is seeded (role: `ADMIN`).
- Existing seeded emails are not recreated.

## Endpoints

- `POST /auth/admin/login`
- `POST /auth/student/login`
- `POST /auth/refreshToken`
- `POST /admin/students`
- `POST /admin/tasks/assign`
- `GET /student/tasks`
- `PATCH /student/tasks/:taskId/complete`

## Auth Response Example

```json
{
  "status": true,
  "message": "admin login success",
  "data": {
    "accessToken": "<access-token>",
    "refreshToken": "<refresh-token>"
  }
}
```
