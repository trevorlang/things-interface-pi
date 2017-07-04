'use strict';

var _http = require('http');

var _socket = require('socket.io-server');

var _socket2 = _interopRequireDefault(_socket);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _output = require('/output');

var _output2 = _interopRequireDefault(_output);

var _thingsInterfaceConfig = require('things-interface.config.js');

var _thingsInterfaceConfig2 = _interopRequireDefault(_thingsInterfaceConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// var server = require('http').createServer();
// var io = require('socket.io')(server);
// const path = require('path');
// const Output = require('./output');
// import config from 'things-interface.config.js'

var led = new _output2.default(4);

var PORT = 1337;

console.log('running');

_socket2.default.sockets.on('connection', function (client) {

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

      default:

        var postData = {
          event_type: data.action,
          device_name: _thingsInterfaceConfig2.default.name
        };
        client.emit('unknown_device_event', postData);
    }

    console.log('data', data);

    if (data.action === "led_change") {
      console.log(data);
      if (data.state === 1) {
        console.log(led);
        led.on();
      } else {
        led.off();
      }
    }

    console.log('Web socket message:', data);
  });
});

_http.server.listen(PORT);
