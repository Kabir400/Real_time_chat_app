const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//soket connection---
let userName;
io.on("connection", (socket) => {
  socket.on("chat-message", (data) => {
    socket.broadcast.emit("chat-others", data);
    socket.emit("chat-own", data);
  });
  socket.on("user-joined", (data) => {
    userName = data;
    socket.broadcast.emit("new-user-joined", data);
    socket.emit("new-user-joined", "you");
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", userName);
  });
});

// satic hosting---
app.use(express.static(path.resolve(__dirname, "..", "public")));

// app.get("/", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
// });

server.listen(process.env.port);
