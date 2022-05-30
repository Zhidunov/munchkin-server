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
        imageSrc: "http://localhost/img/doors_class_halfling_1.jpg",
      },
      {
        id: "1_2",
        text: "private_cards 2",
        imageSrc: "http://localhost/img/doors_class_thief_1.jpg",
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
        imageSrc: "http://localhost/img/doors_class_halfling_2.jpg",
      },
      {
        id: "2_2",
        text: "cards_on_board 2",
        imageSrc: "http://localhost/img/doors_class_warrior_1.jpg",
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
        imageSrc: "http://localhost/img/oscillococcinum.png",
      },
      {
        id: "1_5",
        text: "private_cards 5",
        imageSrc: "http://localhost/img/doors_class_warrior_2.jpg",
      },
      {
        id: "1_6",
        text: "private_cards 6",
        imageSrc: "http://localhost/img/tigers_blood.png",
      },
    ],
    cards_on_board: [
      {
        id: "2_4",
        text: "cards_on_board 4",
        imageSrc: "http://localhost/img/doors_class_wizard_1.jpg",
      },
      {
        id: "2_5",
        text: '<h1 class="cardName">Вор</h1><p class="header">Подрезка:</p>Можешь скинуть 1 карту, чтобы подрезать другого игрока (-2 в бою). Можешь делать это только один раз в отношении одной жертвы в одном бою; если 2 игрока совместно валят мостра, можешь подрезать их обоих.\n<p class="header">Кража:</p> Можешь скинуть 1 карту, чтобы попытаться стырить маленькую шмотку у другого игрока. Брось кубик: 4 и больше - удачная кража, иначе тебя лупят, и ты теряешь 1 Уровень.',
        imageSrc: "http://localhost/img/doors_class_thief_2.jpg",
      },
    ],
  },
  {
    name: "Максим",
    id: "Максим",
    level: 4,
    private_cards: [
      {
        id: "1_7",
        text: "private_cards 4",
        imageSrc: "http://localhost/img/doors_class_thief_3.jpg",
      },
    ],
    cards_on_board: [
      {
        id: "2_6",
        text: '<h1 class="cardName">Волшебник</h1><p class="header">Заклинание Полёта:</p> Можешь сбросить до 3 карт после броска на Смывку; каждая даёт +1 к Смывке.\n<p class="header">Заклинание Усмирения:</p> Можешь сбросить всю **руку** (мин. 3 карты), чтобы усмирить одного монстра и не драться с ним; ты получаешь только его Сокровища, но не Уровень. Если в бою учавствуют монстры, с ними придётся воевать.',
        imageSrc: "http://localhost/img/doors_class_wizard_2.jpg",
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
      text: '<h1 class="cardName">Драконье копьё</h1><p>Бонус +2</p><p>Одноручное</p><p>Стоимость: <span class="price">200</span> голды.</p>',
      imageSrc: "http://localhost/img/dragon_lance.png",
    },
    {
      id: 776,
      text: "Main board 2",
      imageSrc: "http://localhost/img/doors_class_warrior_3.jpg",
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
