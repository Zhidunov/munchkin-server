import express, { json } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerUserHandler } from "./userHandler";
import mongoose from "mongoose";
import authRouter from "./authRouter";

import { CLASSES, RACES } from "./constants";
import Card from "./models/Card";

const app = express();

app.use(cors());
app.use(json());
app.use(express.static("public"));
app.use("/auth", authRouter);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 80;

const url = "mongodb://localhost:27017/munchkin";
// const client = new MongoClient(url);
const dbName = "munchkin";

async function startApp() {
  // Use connect method to connect to the server
  await mongoose.connect(url);
  // const db = client.db(dbName);
  // const collection = db.collection("cards");

  // const findResult = await collection.find({}).toArray();
  // console.log("Found documents =>", findResult);

  const rooms = new Map();
  rooms.set("1", {
    room_id: "1",
    password: "password",
    main_board: {
      cards_on_board: [],
      decks_of_cards: {
        doors_deck: [],
        treasures_deck: [],
        discarded_doors: [],
        discarded_treasures: [],
      },
    },
    players: [
      {
        name: "Никита",
        id: "user_1",
        level: 1,
        class: CLASSES.THIEF,
        race: RACES.HUMAN,
        private_hand: [],
        public_hand: [],
      },
      {
        name: "Максим",
        id: "user_2",
        level: 3,
        class: CLASSES.CLERIC,
        race: RACES.ELF,
        private_hand: [],
        public_hand: [],
      },
      {
        name: "Женя",
        id: "user_3",
        level: 7,
        class: CLASSES.WARRIOR,
        race: RACES.HUMAN,
        private_hand: [],
        public_hand: [],
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

  app.post("/card", async (req, res) => {
    const {
      name,
      description,
      type,
      price,
      bonus,
      is_big,
      is_rotated,
      is_selected,
      slot,
      related_cards,
      image_src,
    } = req.body;

    const card = await Card.create({
      name,
      description,
      type,
      price,
      bonus,
      is_big,
      is_rotated,
      is_selected,
      slot,
      related_cards,
      image_src,
    });

    res.json(card);
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
}

startApp();
