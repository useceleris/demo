# Celeris Quickstart (TypeScript)

A small chat room in two browser tabs. The backend signs access. The browser connects to Celeris with the signed credentials and sends and receives messages.

The [Quickstart](https://useceleris.com/docs/getting-started/quickstart) explains each step.

```
quickstart_js/
  backend/    Express + TypeScript: signs credentials (server.ts)
  frontend/   Vite + Vue + TypeScript: the chat page (src/ChatRoom.vue connects to Celeris)
```

## Run it

You need Node.js 24.15 or newer in the 24.x line, and a Celeris app with API keys.

1. Start the backend:

   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

   Put your client ID and signing secret in `.env`. Then run `npm start`.

2. In a second terminal, start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open `http://localhost:5173` in two tabs. Join as Ada in one tab and as Grace in the other. Then send a message.

The signing secret stays in `backend/.env`. Do not commit `.env`.

## Where to look

- `backend/server.ts`: `POST /api/realtime-credentials` signs access to `demo-room` for a user in the `users` object. Replace the comment and the `users` object with your own sign-in and database. Node runs the file directly, so there is no build step.
- `frontend/src/ChatRoom.vue`: gets credentials, subscribes to the `chat` segment, connects when it appears, and sends messages.
- `frontend/src/App.vue`: the sign-in screen.

Run `npm run typecheck` in either folder to check the types.
