const WebSocket = require("ws");
const server = require("../express/index");

const wss = new WebSocket.Server({ server });

module.exports = wss;
