import express, { json } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerUserHandler } from "./userHandler";

const app = express();

app.use(cors());
app.use(json());
app.use(express.static("public"));

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 80;

const rooms = new Map();

// const players = new Map();
const players = [
  {
    name: "Никита",
    id: "Никита",
    level: 1,
    private_cards: [
      {
        id: "1_1",
        text: "private_cards 1",
        imageSrc: "http://localhost/img/magic_mirror.png",
      },
      {
        id: "1_2",
        text: "private_cards 2",
        imageSrc: "http://localhost/img/dragon_lance.png",
      },
      {
        id: "1_3",
        text: "private_cards 3",
        imageSrc: "http://localhost/img/magic_mirror.png",
      },
    ],
    cards_on_board: [
      {
        id: "2_1",
        text: "cards_on_board 1",
        imageSrc: "http://localhost/img/magic_mirror.png",
      },
      {
        id: "2_2",
        text: "cards_on_board 2",
        imageSrc: "http://localhost/img/magic_mirror.png",
      },
      {
        id: "2_3",
        text: "cards_on_board 3",
        imageSrc: "http://localhost/img/magic_mirror.png",
      },
    ],
  },
  {
    name: "Женя",
    id: "Женя",
    level: 7,
    private_cards: [
      {
        id: "1_4",
        text: "private_cards 4",
        imageSrc: "http://localhost/img/magic_mirror.png",
      },
      {
        id: "1_5",
        text: "private_cards 5",
        imageSrc: "http://localhost/img/magic_mirror.png",
      },
      {
        id: "1_6",
        text: "private_cards 6",
        imageSrc: "http://localhost/img/magic_mirror.png",
      },
    ],
    cards_on_board: [
      {
        id: "2_4",
        text: "cards_on_board 4",
        imageSrc: "http://localhost/img/magic_mirror.png",
      },
      {
        id: "2_5",
        text: "cards_on_board 5",
        imageSrc: "http://localhost/img/magic_mirror.png",
      },
      {
        id: "2_6",
        text: "cards_on_board 6",
        imageSrc: "http://localhost/img/magic_mirror.png",
      },
    ],
  },
];

// const mainBoard = new Map();
const mainBoard = {
  name: "Main board",
  cards: [
    {
      id: 777,
      text: "Main board 1",
      imageSrc: "http://localhost/img/dragon_lance.png",
    },
  ],
};

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

app.get("/players", (req, res) => {
  // const { id: roomId } = req.params;
  res.json({ players });
});
app.get("/mainboard", (req, res) => {
  // const { id: roomId } = req.params;
  res.json(mainBoard);
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
  // registerUserHandler({ players, mainBoard, socket });
};
// const onConnection = (socket) => {
//   registerUserHandler(rooms, socket);
// };

io.on("connection", onConnection);

server.listen(PORT, () => console.log(`listening on port ${PORT}`));
