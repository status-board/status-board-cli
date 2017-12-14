#!/usr/bin/env node
var commands = require('./commands');
var fs = require('fs');
var path = require('path');

require('colors');

function showHelp() {
  var projectPackageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../..', 'package.json')));
  console.log([
    '\n  Atlasboard Version ' + projectPackageJson.version.yellow + '\n',
    '  usage: atlasboard [' + 'command'.yellow + '] [options]\n',
    '  LIST OF AVAILABLE COMMANDS:\n'
  ].join('\n'))

  for (var c in commands) {
    console.log('  %s: %s. Example: \n  \t%s \n', c.yellow, commands[c].descr, commands[c].example.gray);
  }
}

var args = process.argv; // node, atlasboard, command, args
var command = args[2]; // command name
var commandArguments = args.slice(3);

if (commands[command]) {
  commands[command].run(commandArguments, function (err) {
    if (err) {
      console.error(typeof err == "string" ? ('  ' + err.red): err);
      process.exit(1);
    }
  });
}
else {
  showHelp();
}
