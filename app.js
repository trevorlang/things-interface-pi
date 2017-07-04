var server = require('http').createServer();
var io = require('socket.io')(server);
const path = require('path');
const Output = require('./output');

const led = new Output(4);

const PORT = 1337;

console.log('running');

io.on('connection', function(client){

  client.emit('device_connected', {
    'type': 'Raspberry Pi 3',
    'name': 'OfficePi',
    'supported_events' : [
      'success',
      'success_led_on',
      'success_led_off'
    ],
  })

  console.log('Client connected');

  io.on('close', () => console.log('Client disconnected'));

  client.on('interface', function incoming(data) {

    console.log('data', data);

    if (data.action === "led_change") {
      if (data.state === 1) {
        console.log(led);
        led.on();
      } else {
        led.off();
      }
    }

    console.log(`Web socket message:`, data);

  });

});

server.listen(PORT);
