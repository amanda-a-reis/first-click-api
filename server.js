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

    const currentSession = sessions[sessionId];

    console.log(`User ${nickname} enter session ${sessionId}`)

    if (!currentSession) {
      currentSession = {
        currentPlayers: new Set(),
        roundQueueSet: new Set(),
        firstPlayer: null,
        players: [],
      };
    }

    currentSession.currentPlayers.add(nickname);

    const player = { [nickname]: avatar };

    currentSession.players.push(player);

    const firstPlayer = currentSession.firstPlayer || "";

    const data = JSON.stringify({
      firstPlayer,
      players: currentSession.players
    });

    console.log("Data to send >> ", data);

    broadcastToSession(sessionId, data);
  });

  ws.on("close", () => {
    // Lógica para desconexão, se necessário
  });
});

server.listen(3001, () => console.log("Listening on port: " + 3001));
