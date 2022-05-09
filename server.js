import express, { json } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerUserHandler } from "./userHandler";

const app = express();

app.use(cors());
app.use(json());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 80;

const rooms = new Map();

app.get("/rooms/:id", (req, res) => {
  const { id: roomId } = req.params;

  const response = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get("users").values()],
        messages: [...rooms.get(roomId).get("messages").values()],
      }
    : { users: [], messages: [] };
  res.json(response);
});

app.post("/rooms", (req, res) => {
  const { userName, roomId } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ["users", new Map()],
        ["messages", []],
      ])
    );
  }
  res.send();
});

const onConnection = (socket) => {
  registerUserHandler(rooms, socket);
};

io.on("connection", onConnection);

server.listen(PORT, () => console.log(`listening on port ${PORT}`));
