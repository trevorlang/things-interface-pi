'use strict'

let Gpio = require('onoff').Gpio;

function Output(location) {

  this.pin = new Gpio(location, 'out');

  this.on = function() {
    this.pin.write( 1, function() {
  		console.log(`Led on`);
  	});
  }

  this.off = function() {
    this.pin.write( 0, function() {
  		console.log(`Led off`);
  	});
  }
}

export default Output;
