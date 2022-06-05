export const registerUserHandler = ({ rooms, socket, io }) => {
  const joinUser = ({ roomId }) => {
    socket.join(roomId);
  };
  const startedMovingCard = ({ card, board, roomId }) => {
    socket.to(roomId).emit("GAME:STARTED_MOVING_CARD", { card, board });
  };
  const finishedMovingCard = ({ card, board, roomId }) => {
    socket.to(roomId).emit("GAME:FINISHED_MOVING_CARD", { card, board });
  };

  socket.on("ROOM:JOIN", joinUser);
  socket.on("GAME:STARTED_MOVING_CARD", startedMovingCard);
  socket.on("GAME:FINISHED_MOVING_CARD", finishedMovingCard);
  // socket.on("ROOM:SEND_MESSAGE", sendMessage);
  // socket.on("disconnect", disconnectUser);
};
// export const registerUserHandler = (rooms, socket) => {
//   const joinUser = ({ roomId, userName }) => {
//     socket.join(roomId);
//     rooms.get(roomId)?.get("users")?.set(socket.id, userName);
//     const users = [...rooms.get(roomId)?.get("users")?.values()];
//     socket.to(roomId).emit("ROOM:JOINED", users);
//   };

//   const sendMessage = ({ roomId, userName, text }) => {
//     console.log("ROOM:SEND_MESSAGE: ", roomId, userName, text);
//     rooms
//       .get(roomId)
//       ?.get("messages")
//       ?.push({ userName, text, id: new Date() });
//     const messages = [...rooms.get(roomId)?.get("messages")?.values()];
//     socket.to(roomId).emit("ROOM:SENDED_MESSAGE", messages);
//   };

//   const disconnectUser = () => {
//     rooms.forEach((value, roomId) => {
//       if (value.get("users")?.delete(socket.id)) {
//         const users = [...value.get("users")?.values()];
//         socket.to(roomId).emit("ROOM:LEAVED", users);
//       }
//     });
//   };

//   socket.on("ROOM:JOIN", joinUser);
//   socket.on("ROOM:SEND_MESSAGE", sendMessage);
//   socket.on("disconnect", disconnectUser);
// };
