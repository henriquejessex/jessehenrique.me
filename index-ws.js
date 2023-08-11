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

process.on('SIGINT', () => {
    console.log('sigint');
    wss.clients.forEach(function each(client) {
        client.close(); // fecha a conexão
    });
    server.close(() => {
        shutdownDB();
    });

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

    db.run(`INSERT INTO visitors (count, time)
        VALUES (${numClients}, datetime('now'))
    `);

    ws.on('close', function close() {
        console.log('Client disconnected. Total: ' + wss.clients.size);
        wss.broadcast(`current clients: ${numClients}`);
    });
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
}/** end websockets */

/** begin database */
const sqlite = require('sqlite3');
const db = new sqlite.Database(':memory:');

db.serialize(() => {
    db.run(`
        CREATE TABLE visitors (
            count INTEGER,
            time TEXT
        )
    `)
});

function getCounts(){
    db.each("SELECT * FROM visitors", (err, row) => {
        console.log(row);
    })
}

function shutdownDB() {
    getCounts();
    console.log('shutting down db');
    db.close();
}