var fs = require('fs');
var path = require('path');
var extend = require('xtend');
var debug = require('debug')('config-manager');

exports = module.exports = function (configFileName) {

  function readConfigIfExists(fileName) {
    if (!path.extname(fileName)) {
      fileName = fileName + '.js';
    }
    if (fs.existsSync(fileName)) {
      return require(fileName);
    }
    return {};
  }

  function readEnv() {
    var key = 'ATLASBOARD_CONFIG_' + configFileName;
    debug('ENV key', key);
    if (process.env[key]) {
      debug('ENV configuration found for', key);
      try {
        var configValue = JSON.parse(process.env[key]);
        if (typeof configValue === 'object') {
          return JSON.parse(process.env[key]);
        } else {
          throw 'ENV configuration key ' + key + ' could not be serialized into an object: ' + process.env[key];
        }
      } catch (e) {
        throw 'ENV configuration key ' + key + ' contains invalid JSON: ' + process.env[key];
      }
    }
  }

  var localConfigFilePath = path.join(process.cwd(), 'config', configFileName);
  var atlasboardConfigFilePath = path.join(__dirname, '../config/', configFileName);

  return extend(
      readConfigIfExists(atlasboardConfigFilePath),
      readConfigIfExists(localConfigFilePath),
      readEnv()
  );
};