var server = require('http').createServer();
var io = require('socket.io')(server);
const path = require('path');
const Output = require('./output');
const config = require('./things-interface.config.js');

const led = new Output(4);

const PORT = 1337;

console.log('running');

io.sockets.on('connection', function(client){

  client.emit('initial_data', {status: 'Websocket created'})

  client.emit('device_connected', {
    'type': 'Raspberry Pi 3',
    'name': 'OfficePi',
    'supported_events' : [
      'success',
      'success_led_on',
      'success_led_off'
    ],
  })

  console.log('Client connected:', client.id);

  client.on('close', () => console.log('Client disconnected',  client.id));

  client.on('interface', function incoming(data) {

    switch (data.action) {
      case 'led_change':

        console.log(`LED change event fired`);
        if (data.state === 1) {
          console.log(led);
          led.on();
        } else {
          led.off();
        }

      default:
        var postData = {
          event_type: data.action,
          device_name: config.name
        }
        console.log(`Unknown device event requested: ${data.action}`);
        client.emit('unknown_device_event', postData)
    }

    console.log(`Web socket message:`, data);

  });

});

server.listen(PORT);
