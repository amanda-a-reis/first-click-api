const express = require("express");
const cors = require("cors");

const createSession = require("./controllers/create-session");
const saveAndIdentifyFirstPlayer = require("./controllers/save-and-identify-first-player");
const sessions = require("./data/sessions");
const wss = require("./web-socket/wss");
const app = require("./express/app");
const server = require("./express");

app.use(cors());
app.use(express.json());

app.post("/click", saveAndIdentifyFirstPlayer);

app.post("/create-session", createSession);

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const { sessionId, nickname } = JSON.parse(message);

    ws.sessionId = sessionId;

    ws.send(`Olá ${nickname}, você está conectado.`);

    if (!sessions[sessionId]) {
      sessions[sessionId] = { roundQueueSet: new Set() };
    }
  });

  ws.on("close", () => {
    // Lógica para desconexão, se necessário
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
