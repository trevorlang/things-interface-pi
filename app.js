'use strict';

var _thingsInterfaceConfig = require('things-interface.config.js');

var _thingsInterfaceConfig2 = _interopRequireDefault(_thingsInterfaceConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = require('http').createServer();
var io = require('socket.io')(server);
var path = require('path');
var Output = require('./output');


var led = new Output(4);

var PORT = 1337;

console.log('running');

io.sockets.on('connection', function (client) {

  client.emit('initial_data', { status: 'Websocket created' });

  client.emit('device_connected', {
    'type': 'Raspberry Pi 3',
    'name': 'OfficePi',
    'supported_events': ['success', 'success_led_on', 'success_led_off']
  });

  console.log('Client connected:', client.id);

  client.on('close', function () {
    return console.log('Client disconnected', client.id);
  });

  client.on('interface', function incoming(data) {

    switch (data.action) {
      case 'led_change':

        console.log('LED change event fired');
        if (data.state === 1) {
          console.log(led);
          led.on();
        } else {
          led.off();
        }

      default:
        var postData = {
          event_type: data.action,
          device_name: _thingsInterfaceConfig2.default.name
        };
        console.log('Unknown device event requested: ' + data.action);
        client.emit('unknown_device_event', postData);
    }

    console.log('Web socket message:', data);
  });
});

server.listen(PORT);
