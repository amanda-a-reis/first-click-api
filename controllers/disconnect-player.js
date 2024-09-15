const sessions = require("../data/sessions");
const broadcastToSession = require("../web-socket/broadcast-to-session");

const disconnectPlayer = async (req, res) => {
  const { sessionId, nickname } = req.body;

  const session = sessions[sessionId];

  const firstPlayer = session.firstPlayer || "";

  const players = session.players.filter((v) => {
    const nickName = Object.keys(v)[0];

    return nickName !== nickname;
  });

  session.players = players;
  session.currentPlayers.delete(nickname)

  const data = JSON.stringify({
    firstPlayer,
    players,
    status: "active"
  });

  broadcastToSession(sessionId, data);

  return res.status(200).send({ message: "Ok!" });
};

module.exports = disconnectPlayer;
