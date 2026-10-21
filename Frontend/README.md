# HelpLink frontend

The HelpLink frontend is a React and TypeScript single-page application built with Vite. It provides the student sign-in and registration flow, request management, profile and notification pages, and the administrator request workspace.

## Development

Install dependencies and start the Vite server:

```sh
npm install
npm run dev
```

The Vite development server proxies `/api` requests to `http://localhost:5000`. Start the backend separately. To use another API base URL, set `VITE_API_URL` in the frontend environment.

## Production build

```sh
npm run build
```

The Dockerfile creates a production build and serves it through Nginx on port 80. Nginx forwards `/api` calls to the `backend` service, and serves the React application for client-side routes.
