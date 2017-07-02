const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
const Output = require('./output');

const led = new Output(4);

const PORT = 1337;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {

  console.log('Client connected');

  ws.on('close', () => console.log('Client disconnected'));

  ws.on('message', function incoming(data) {

    const json_data = JSON.parse(JSON.parse(data));

    console.log('data', json_data);

    if (json_data.action === "led_change") {
      if (json_data.state === 1) {
        console.log(led);
        led.on();
      } else {
        led.off();
      }
    }

    console.log(`Web socket message:`, data);
  });
});
