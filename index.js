const express = require("express"),
  http = require("http"),
  { Server } = require("socket.io"),
  cors = require("cors");

const route = require("./route");
const { addUser, getRoomUsers, removeUser } = require("./users");
const { clear } = require("console");

const app = express();

app.use(cors({ origin: "*" }));
app.use(route);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }) => {
    socket.join(room);

    const { user } = addUser({ name, room });

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to room ${user.room}`,
    });

    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name}, added to room ${user.room}`,
    });

    io.to(user.room).emit("joinRoom", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
  socket.on("out", (u) => {
    const isOutUser = removeUser(u);
    socket.to(isOutUser.room).emit("message", {
      user: "admin",
      text: `${isOutUser.name}, out to room ${isOutUser.room}`,
    });
    io.to(isOutUser.room).emit("joinRoom", {
      room: isOutUser.room,
      users: getRoomUsers(isOutUser.room),
    });
  });

  socket.on("sendM", ({ message, params }) => {
    socket.broadcast.to(params.room).emit("message", {
      user: params.name,
      text: message,
    });
  });

  io.on("disconnect", () => {
    console.log("disconnected");
  });
});

server.listen(5000, () => {
  console.log("hello world");
});
