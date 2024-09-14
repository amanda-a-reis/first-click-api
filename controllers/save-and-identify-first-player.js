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
    session.firstPlayerNickname = nickname;
  }

  session.roundQueueSet.add(nickname);

  broadcastToSession(
    sessionId,
    `O primeiro a clicar foi ${session.firstPlayerNickname}`
  );

  res.status(200).json({ message: "Voto registrado" });
};

module.exports = saveAndIdentifyFirstPlayer;
