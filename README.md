# Student Management API (NestJS + MongoDB Atlas)

A standalone NestJS API with clean architecture style modules, JWT access/refresh tokens, RBAC, and Scalar API documentation.

## API URL

- Base URL (local): `http://localhost:8080`
- Scalar docs (local): `http://localhost:8080/api-reference`
- Swagger docs (local): `http://localhost:8080/api`
- OpenAPI JSON (local): `http://localhost:8080/api/json`
- Base URL (live): `https://student-management-api-635306411131.asia-south1.run.app`
- Scalar docs (live): `https://student-management-api-635306411131.asia-south1.run.app/api-reference`
- Swagger docs (live): `https://student-management-api-635306411131.asia-south1.run.app/api`
- OpenAPI JSON (live): `https://student-management-api-635306411131.asia-south1.run.app/api/json`

## Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | App port |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `TOKEN_SECRET` | Access token signing secret |
| `REFRESH_TOKEN_SECRET` | Refresh token signing secret |
| `JWT_EXPIRY` | Access token expiry |
| `REFRESH_JWT_EXPIRY` | Refresh token expiry |
| `DEFAULT_ADMIN_NAME` | Seeded admin name |
| `DEFAULT_ADMIN_EMAIL` | Seeded admin email |
| `DEFAULT_ADMIN_PASSWORD` | Seeded admin password |

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
