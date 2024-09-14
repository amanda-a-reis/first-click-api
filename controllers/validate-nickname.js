const sessions = require("../data/sessions");

const validateNickName = (req, res) => {
  const { sessionId, nickName } = req.body;

  const hasNickName = sessions[sessionId].currentPlayers.has(nickName);
  
  console.log("hasNickName", hasNickName)

  if (hasNickName) {
    return res.status(400).send({ message: "Esse nickname já está em uso" });
  }

  return res.status(200).send({ message: "Ok!" });
};

module.exports = validateNickName;
