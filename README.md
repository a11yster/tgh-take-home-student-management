# Student Management API (NestJS + MongoDB Atlas)

A standalone NestJS API with clean architecture style modules, JWT access/refresh tokens, RBAC, and Scalar API documentation.

## Local URL

- Base URL: `http://localhost:8080`
- Scalar docs: `http://localhost:8080/api-reference`
- Swagger docs: `http://localhost:8080/api`
- OpenAPI JSON: `http://localhost:8080/api/json`

## Live URL

- Base URL: `https://student-management-api-635306411131.asia-south1.run.app`
- Swagger docs: `https://student-management-api-635306411131.asia-south1.run.app/api`
- Scalar docs: `https://student-management-api-635306411131.asia-south1.run.app/api-reference`
- OpenAPI JSON: `https://student-management-api-635306411131.asia-south1.run.app/api/json`

## Demo Credentials (Live)

- Admin email: `admin@example.com`
- Admin password: `ChangeMe123!`
- Student credentials: create a student via `POST /admin/students`, then use that student's email and password with `POST /auth/student/login`.

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
- `GET /admin/students`
- `POST /admin/tasks/assign`
- `GET /student/tasks`
- `PATCH /student/tasks/:taskId/complete`

## Pagination Note

- Current implementation returns full lists for `GET /admin/students` and `GET /student/tasks` since this is a demo task for tgh

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

## Constraint Notes

- Task `dueAt` accepts any valid ISO date-time; if the due date is already in the past, the task is created successfully and appears as `OVERDUE` when fetched.
- Only `ADMIN` users can create students and assign tasks; only `STUDENT` users can view and complete their own tasks.
- `PATCH /student/tasks/:taskId/complete` is idempotent for completed tasks (calling it again keeps status as `COMPLETED`).
- A task can be assigned only to an existing student ID; invalid/non-student IDs are rejected.
- List endpoints currently return full datasets (`GET /admin/students`, `GET /student/tasks`); pagination is recommended for production scale.
