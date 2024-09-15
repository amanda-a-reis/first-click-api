const sessions = require("../data/sessions");
const broadcastToSession = require("../web-socket/broadcast-to-session");

const saveAndIdentifyFirstPlayer = (req, res) => {
  const { sessionId, nickname } = req.body;

  const session = sessions[sessionId];

  if (!session || !session.currentPlayers.has(nickname)) {
    return res.status(400).send({ message: "disconnected" });
  }

  if (session.firstPlayer) {
    return res.status(200).send({ message: "Ok!" });
  }

  console.log("nickname", nickname);
  console.log("sessionId", sessionId);

  if (session.roundQueueSet.size === 0) {
    session.firstPlayer = nickname;
  }

  const firstPlayer = session.firstPlayer || "";

  console.log("firstPlayer", firstPlayer);

  const data = JSON.stringify({
    firstPlayer,
    players: session.players,
  });

  broadcastToSession(sessionId, data);

  res.status(200).json({ message: "Click registrado" });
};

module.exports = saveAndIdentifyFirstPlayer;
