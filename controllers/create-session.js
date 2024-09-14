const sessions = require("../data/sessions");

const createSessionId = () => {
  return "session-" + Math.random().toString(36).substr(2, 9);
};

const createSession = (req, res) => {
  const sessionId = createSessionId();

  sessions[sessionId] = {
    currentPlayers: new Set(),
    roundQueueSet: new Set(),
    firstPlayer: null,
  };

  res.status(201).send({ sessionId });
};

module.exports = createSession;
