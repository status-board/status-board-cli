"use strict";

var atlasboard;

try {
  atlasboard = require('atlasboard');
} catch(e) {
  console.log('Ups!, no Atlasboard module could be found locally, so you can not run this script yet!');
  console.log('You can either:');
  console.log(' a) install atlasboard locally: `npm install atlasboard --save`. Then rerun this script.');
  console.log(' b) run this wallboard using the global atlasboard binary: `atlasboard start 3000`');
  process.exit();
}

atlasboard({port: process.env.ATLASBOARD_PORT || 3000, install: true}, function (err) {
  if (err) {
    throw err;
  }
});