const { WebSocket } = require("ws");
const wss = require("./wss");

const broadcastToSession = (sessionId, data) => {
  wss.clients.forEach((client) => {
    if (
      client.readyState === WebSocket.OPEN &&
      client.sessionId === sessionId
    ) {
      client.send(data);
    }
  });
};

module.exports = broadcastToSession;
