const sessions = require("../data/sessions");
const broadcastToSession = require("../web-socket/broadcast-to-session");

const resetRound = async (req, res) => {
  const { sessionId } = req.body;

  sessions[sessionId] = {
    ...sessions[sessionId],
    roundQueueSet: new Set(),
    firstPlayer: null,
  };

  const session = sessions[sessionId];

  const firstPlayer = session.firstPlayer || "";

  const data = JSON.stringify({
    firstPlayer,
    players: session.players,
  });

  broadcastToSession(sessionId, data);

  return res.status(200).send({ message: "Ok!" });
};

module.exports = resetRound;
