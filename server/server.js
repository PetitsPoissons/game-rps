const http = require('http');
const express = require('express');
const socketio = require('socket.io');
// import rps game logic
const RpsGame = require('./rps-game');

const app = express();

// static middleware to serve static files
const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

// set-up express as listener to server
const server = http.createServer(app);

// set-up socket.io server - it will not interfere with express
const io = socketio(server);

// check if a second player is waiting on the server
let waitingPlayer = null;

// whenever a user gets connected to the server, we will receive an event called 'connection'
io.on('connection', (sock) => {
  // this message will be passed to each newly connected user
  sock.emit('message', 'Hi, you are connected');

  // connect two players
  if (waitingPlayer) {
    // start a game
    new RpsGame(waitingPlayer, sock);
    waitingPlayer = null; // we can connect 'sock' and 'waitingPlayer', so there is no longer any waiting player and we can set it at 'null'
  } else {
    waitingPlayer = sock; // there's only one player, which is the one on the socket ('sock')
    waitingPlayer.emit('message', 'Waiting for an opponent'); // send a message to the waiting player
  }

  // whenever we receive a message from a user, we send it back to everyone who is connected
  sock.on('message', (text) => {
    io.emit('message', text);
  });
});

// express server listening
server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8080, () => {
  console.log('RPS started on 8080');
});
