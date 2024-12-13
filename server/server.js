const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let gameState = {
  board: Array(9).fill(null),
  isXTurn: true,
  winner: null,
};

let score = { X: 0, O: 0 };

io.on("connection", (socket) => {
  console.log("A user connected!");

  socket.emit("updateBoard", gameState);
  socket.emit("updateScore", score);

  socket.on("makeMove", (newState) => {
    gameState = newState;
    io.emit("updateBoard", gameState);
  });

  socket.on("updateScore", ({ winner }) => {
    if (winner === "X") {
      score.X += 1;
    } else if (winner === "O") {
      score.O += 1;
    }
    io.emit("updateScore", score);
  });

  socket.on("restartGame", () => {
    gameState = {
      board: Array(9).fill(null),
      isXTurn: true,
      winner: null,
    };
    io.emit("updateBoard", gameState);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected!");
  });
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
