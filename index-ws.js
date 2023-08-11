const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', function(req, res) {
  res.sendFile('index.html', {root: __dirname});
});

server.on('request', app);

server.listen(3000, function() {
      console.log('server started on port 3000.');
});

/**Begin websockets */

const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({server: server});

wss.on('connection', function connection(ws) {
    const numClients = wss.clients.size;
    console.log('Client connected. Total: ' + numClients);

    wss.broadcast(`current clients: ${numClients}`);

    // mensagem para cada cliente
    if(ws.readyState === ws.OPEN) {
        ws.send('Welcome to my server!');
    }

    ws.on('close', function close() {
        console.log('Client disconnected. Total: ' + wss.clients.size);
        wss.broadcast(`current clients: ${numClients}`);
    });
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
}