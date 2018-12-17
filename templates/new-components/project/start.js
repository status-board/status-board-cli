"use strict";

var statusBoard;
const options = {
  port: process.env.ATLASBOARD_PORT || process.env.STATUS_BOARD_PORT || 3000,
  install: false
};

function callback(err) {
  if (err) {
    throw err;
  }
}

try {
  statusBoard = require('status-board').default;
} catch(e) {
  console.log('Ups!, no status-board module could be found locally, so you can not run this script yet!');
  console.log('You can either:');
  console.log(' a) install Status Board locally: `npm install status-board --save`. Then rerun this script.');
  console.log(' b) run this wallboard using the global Status Board binary: `status-board start 3000`');
  process.exit();
}

statusBoard(options, callback);
