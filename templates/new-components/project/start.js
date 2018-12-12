"use strict";

var statusBoard;

try {
  statusBoard = require('status-board');
} catch(e) {
  console.log('Ups!, no Status Board module could be found locally, so you can not run this script yet!');
  console.log('You can either:');
  console.log(' a) install Status Board locally: `npm install Status Board --save`. Then rerun this script.');
  console.log(' b) run this wallboard using the global Status Board binary: `Status Board start 3000`');
  process.exit();
}

statusBoard({port: process.env.ATLASBOARD_PORT || process.env.STATUS_BOARD_PORT || 3000, install: true}, function (err) {
  if (err) {
    throw err;
  }
});
