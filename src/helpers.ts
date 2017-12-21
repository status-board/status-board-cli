var fs = require('fs');
var path = require('path');

module.exports = {

  isPathContainedInRoot : function(pathDir, root){
    if (typeof root !== 'string' || typeof pathDir !== 'string'){
      return false;
    }

    if (pathDir[0] !== "/") {
      pathDir = path.join(process.cwd(), pathDir);
    }
    return pathDir.indexOf(root) === 0;
  },

  //-----------------------------------------
  // Accepts a list of files or directory names
  // Returns "" if invalid.
  //-----------------------------------------
  areValidPathElements : function(paths) {

    function valid(path){
      if (!path) {
        return false;
      }

      var malicius = false;
      path = path.toString(); //in case it is another type, like number

      if ((path.indexOf("/") !== -1) || (path.indexOf("\\") !== -1)) {
        malicius = true;
      }

      if (path.indexOf("..") !== -1) {
        malicius = true;
      }

      if (path.indexOf('\0') !== -1) {
        malicius = true;
      }

      if (malicius){
        console.log("Malicious path detected: %s", path);
        return false;
      }
      else {
        return true;
      }
    }

    paths = Array.isArray(paths) ? paths : [paths];
    return paths.every(valid);
  },

  getRndInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  readJSONFile: function (dashboardPath, cb) {
    fs.readFile(dashboardPath, function read(err, data){
      if (err) { return cb (err); }
      try {
        cb(null, JSON.parse(data));
      } catch(e){
        cb(e);
      }
    });
  },

  getJSONFromFile: function (path, defaultValue, warnIfFileNotExists, warnIfFileIsInvalid){
    try {
      if (!fs.existsSync(path)){
        if (warnIfFileNotExists) {
          warnIfFileNotExists(path);
        }
        return defaultValue;
      }
      return JSON.parse(fs.readFileSync(path));
    }
    catch (e){
      if (warnIfFileIsInvalid) {
        warnIfFileIsInvalid(path, e);
      }
      return defaultValue;
    }
  }
};