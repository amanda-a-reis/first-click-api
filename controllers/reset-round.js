const roundQueueSet = require("../rounds-queue/round-queue-set");

const resetRound = async (req, res) => {
  roundQueueSet.clear();

  return res.status(200).send({ message: "Ok!" });
};

module.exports = resetRound;
