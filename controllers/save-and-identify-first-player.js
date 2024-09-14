const sessions = require("../data/sessions");
const broadcastToSession = require("../web-socket/broadcast-to-session");

const saveAndIdentifyFirstPlayer = (req, res) => {
  const { sessionId, nickname } = req.body;

  if (!sessions[sessionId]) {
    return res.status(400).json({ message: "Sessão não encontrada" });
  }

  const session = sessions[sessionId];

  if (session.firstPlayer) {
    return res.status(200).send({ message: "Ok!" });
  }

  console.log("nickname", nickname);
  console.log("sessionId", sessionId);

  if (session.roundQueueSet.size === 0) {
    session.firstPlayer = nickname;
  }

  const players = Array.from([...session.currentPlayers]);

  const firstPlayer = session.firstPlayer ?? "";

  const data = JSON.stringify({
    firstPlayer,
    players,
  });

  broadcastToSession(sessionId, data);

  res.status(200).json({ message: "Click registrado" });
};

module.exports = saveAndIdentifyFirstPlayer;
