const sessions = require("../data/sessions");

const enterSession = (req, res) => {
  const { sessionId } = req.body;

  const hasSessionId = sessions[sessionId];

  if (!hasSessionId) res.status(400).send({ message: "Sessão incorreta" });

  res.status(201).send({ sessionId });
};

module.exports = enterSession;
