"use strict";
const express = require("express");
const ws = require("ws");
const path = require("path");

const PORT = 3000;
const HOST = "0.0.0.0";

// WebSocket server with dumb echo service
const wss = new ws.Server({ noServer: true });
wss.on("connection", (socket) => {
  // When a message is received
  socket.on("message", function (message) {
    // Log the received message
    const result = 'Received "' + message + '"';
    console.log(result);
    // Now echo the message back
    socket.send(result);
  });
  // When the socket is closed
  socket.on("close", function (reasonCode, description) {
    console.log("Client connection closed.");
  });
});

const app = express(); // Create a new express server
app.use("/", express.static(path.join(__dirname, "static"))); // Serve the static html file
const server = app.listen(PORT, HOST); // Start the server listening on PORT, HOST
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (socket) => {
    wss.emit("connection", socket, request);
  });
});

console.log(`Running on http://${HOST}:${PORT}`);
