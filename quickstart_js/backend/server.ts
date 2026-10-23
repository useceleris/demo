import express from "express";
import { createSigner } from "@useceleris/server";

// createSigner() refuses missing values when the server starts.
const signer = createSigner({
  clientId: process.env.CELERIS_CLIENT_ID!,
  signingSecret: process.env.CELERIS_SIGNING_SECRET!,
});

type User = { name: string; rooms: string[] };

// A stand-in for your user database.
const users: Record<string, User> = {
  ada: { name: "Ada", rooms: ["demo-room"] },
  grace: { name: "Grace", rooms: ["demo-room"] },
};

const app = express();
app.use(express.json());

// The people that the page shows on its sign-in screen.
app.get("/api/users", (req, res) => {
  res.json(Object.entries(users).map(([id, user]) => ({ id, name: user.name })));
});

app.post("/api/realtime-credentials", (req, res) => {
  // Add your own auth here: find the signed-in user from the session.
  // This demo trusts the user ID that the page sends.
  const userId: string = req.body.userId;
  const room: string = req.body.channelReference;

  if (!users[userId]?.rooms.includes(room)) {
    res.status(403).json({ error: "Not allowed." });
    return;
  }

  res.json(
    signer.sign({
      channels: { kind: "restricted", references: [room] },
      permissions: {
        kind: "restricted",
        segments: [{ segmentId: "chat", read: true, write: true }],
      },
      reference: userId,
    }),
  );
});

app.listen(4000, "127.0.0.1", () => {
  console.log("Backend: http://127.0.0.1:4000");
});
