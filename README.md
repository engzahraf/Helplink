# HelpLink

HelpLink is a student support request portal. Students can register, submit requests, follow request progress, manage their profile, and receive notifications. Administrators can review requests, reply to students, and update request status.

## Technology

- Frontend: React, TypeScript, and Vite
- Backend: Node.js, Express, and MySQL
- Deployment: Docker Compose, with Nginx serving the frontend and proxying API requests

## Run with Docker

1. Configure the database connection and other required variables in `backend/.env`. See [backend setup](backend/README.md#environment-variables) for the required values.
2. From the project root, build and start the services:

   ```sh
   docker compose up --build
   ```

3. Open [http://localhost:8080](http://localhost:8080). Set `FRONTEND_PORT` in your shell or a root `.env` file to use a different host port.

The frontend image can also be built independently:

```sh
docker build -t helplink-frontend:latest ./Frontend
```

## Run locally

Start the backend first, with MySQL running and `backend/.env` configured:

```sh
cd backend
npm install
npm run dev
```

In a second terminal, start the frontend:

```sh
cd Frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite proxies `/api` calls to the backend at `http://localhost:5000` during local development.

## Main routes

- `/` — sign in
- `/register` — create a student account
- `/student-dashboard` — student workspace
- `/submit-request` and `/my-requests` — create and track requests
- `/profile` and `/notifications` — account details and updates
- `/admin-dashboard` — admin request queue and replies

API requests require a signed-in user. The backend controls access by role.
