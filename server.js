import express, { json } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerUserHandler } from "./userHandler";
import {
  doorsClassHalfling1,
  doorsClassHalfling2,
  doorsClassThief1,
  doorsClassThief2,
  doorsClassWarrior1,
  doorsClassWarrior2,
  doorsClassWarrior3,
  doorsClassWizard1,
  doorsClassWizard2,
  dragonLance,
  magicMirror,
  oscillococcinum,
  tigersBlood,
  ancient,
} from "./mockCards";
import { CLASSES, RACES } from "./constants";

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
rooms.set("1", {
  room_id: "1",
  password: "password",
  main_board: {
    cards_on_board: [dragonLance, ancient],
    decks_of_cards: {
      doors_deck: [doorsClassHalfling1, doorsClassWizard1],
      treasures_deck: [magicMirror],
      discarded_doors: [doorsClassWizard2],
      discarded_treasures: [oscillococcinum],
    },
  },
  players: [
    {
      name: "Никита",
      id: "user_1",
      level: 1,
      class: CLASSES.THIEF,
      race: RACES.HUMAN,
      private_hand: [doorsClassHalfling2, doorsClassWarrior1],
      public_hand: [doorsClassThief1],
    },
    {
      name: "Максим",
      id: "user_2",
      level: 3,
      class: CLASSES.CLERIC,
      race: RACES.ELF,
      private_hand: [doorsClassThief2, doorsClassHalfling2, doorsClassWarrior1],
      public_hand: [tigersBlood],
    },
    {
      name: "Женя",
      id: "user_3",
      level: 7,
      class: CLASSES.WARRIOR,
      race: RACES.HUMAN,
      private_hand: [doorsClassWarrior2],
      public_hand: [doorsClassWarrior3],
    },
  ],
});

app.get("/room", (req, res) => {
  const userName = req.query.userName;
  const roomId = req.query.roomId;

  const otherPlayers = rooms
    .get(roomId)
    .players.filter((pl) => pl.name !== userName);

  const players = otherPlayers.map((pl) => ({
    name: pl.name,
    id: pl.id,
    level: pl.level,
    class: pl.class,
    race: pl.race,
    cards_in_hand: pl.private_hand?.length,
  }));

  const response = rooms.has(roomId)
    ? {
        players,
        main_board: rooms.get(roomId).main_board,
      }
    : { players: [], main_board: {} };
  res.json(response);
});

app.get("/boards", (req, res) => {
  const userName = req.query.userName;
  const roomId = req.query.roomId;

  const otherPlayers = rooms
    .get(roomId)
    .players.filter((pl) => pl.name !== userName);

  const response = {
    other_players_stuff: otherPlayers.map((pl) => ({
      id: pl.id,
      cards: pl.public_hand,
      cards_in_hand: pl.private_hand?.length,
    })),
  };
  res.json(response);
});

app.get("/user", (req, res) => {
  const userName = req.query.userName;
  const roomId = req.query.roomId;

  const currentUser = rooms
    .get(roomId)
    .players.find((pl) => pl.name === userName);

  const response = {
    current_user: currentUser,
  };
  res.json(response);
});

app.post("/rooms", (req, res) => {
  const { userName, roomId, password } = req.body;
  console.log("🚀 ~ app.post ~ rooms.has(roomId)", rooms.has(roomId));
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      room_id: roomId,
      password: password,
      main_board: {
        cards_on_board: [dragonLance, ancient],
        decks_of_cards: {
          doors_deck: [doorsClassHalfling1, doorsClassWizard1],
          treasures_deck: [magicMirror],
          discarded_doors: [doorsClassWizard2],
          discarded_treasures: [oscillococcinum],
        },
      },
      players: [
        {
          name: userName,
          id: "user_random" + new Date().getTime(),
          level: 1,
          class: null,
          race: RACES.HUMAN,
          private_hand: [],
          public_hand: [],
        },
      ],
    });
  }
  res.send();
});

const onConnection = (socket) => {
  registerUserHandler({ rooms, socket, io });
};

io.on("connection", onConnection);

server.listen(PORT, () => console.log(`listening on port ${PORT}`));
