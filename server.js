const express = require("express");
const cors = require("cors");

const createSession = require("./controllers/create-session");
const saveAndIdentifyFirstPlayer = require("./controllers/save-and-identify-first-player");
const sessions = require("./data/sessions");
const wss = require("./web-socket/wss");
const app = require("./express/app");
const server = require("./express");
const resetRound = require("./controllers/reset-round");
const broadcastToSession = require("./web-socket/broadcast-to-session");
const enterSession = require("./controllers/enter-session");
const validateNickName = require("./controllers/validate-nickname");
const disconnectPlayer = require("./controllers/disconnect-player");

app.use(cors());
app.use(express.json());

app.post("/click", saveAndIdentifyFirstPlayer);

app.post("/create-session", createSession);

app.post("/enter-session", enterSession);

app.post("/reset", resetRound);

app.post("/validate-nickname", validateNickName);

app.post("/disconnect", disconnectPlayer);

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const { sessionId, nickname, avatar } = JSON.parse(message);

    ws.sessionId = sessionId;

    console.log(`User ${nickname} enter session ${sessionId}`);

    if (!sessions[sessionId]) {
      console.log("CREATING A NEW SESSION")

      sessions[sessionId] = {
        currentPlayers: new Set(),
        roundQueueSet: new Set(),
        firstPlayer: null,
        players: [],
      };
    }

    if (sessions[sessionId].currentPlayers.has(nickname)) {
      const firstPlayer = sessions[sessionId].firstPlayer || "";

      const data = JSON.stringify({
        firstPlayer,
        players: sessions[sessionId].players,
      });

      console.log("Data to send 1 >> ", data);

      broadcastToSession(sessionId, data);
    } else {
      sessions[sessionId].currentPlayers.add(nickname);

      const player = { [nickname]: avatar };

      sessions[sessionId].players.push(player);

      const firstPlayer = sessions[sessionId].firstPlayer || "";

      const data = JSON.stringify({
        firstPlayer,
        players: sessions[sessionId].players,
      });

      console.log("Data to send 2 >> ", data);

      broadcastToSession(sessionId, data);
    }
  });

  ws.on("close", () => {
    // Lógica para desconexão, se necessário
  });
});

server.listen(3001, () => console.log("Listening on port: " + 3001));
