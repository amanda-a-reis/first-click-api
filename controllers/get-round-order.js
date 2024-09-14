const roundQueueSet = require("../data/rounds-queue/round-queue-set");

const getRankingOrder = async (req, res) => {
  const order = Array.from(roundQueueSet).map((value, index) => ({
    id: value,
    ranking: index + 1,
  }));

  return res.status(200).send({
    result: order,
  });
};

module.exports = getRankingOrder;
