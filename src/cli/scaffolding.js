var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var debug = require('debug')('scaffolding');

module.exports = {

  /**
   * Folder scaffolding
   * @param  {string}   templateSourceFolder Templating source
   * @param  {string}   destinationFolder    Destination folder
   * @param  {object}   options (optional)
   *                    options.engine : templating engine ('ejs')
   *                    options.replace : object with replacement options
   * @param  {Function} cb                   Callback (err, null);
   */
  scaffold : function (templateSourceFolder, destinationFolder, options, cb){
    
    if (!cb) { // options parameter is optional
      cb = options;
      options = {};
    }

    function applyReplacements(fileName, replacements){
      for (var item in replacements) {
        var replace = replacements[item];
        if (fileName.indexOf(item) > -1) {
          fileName = fileName.replace(item, replace);
          break;
        }
      }
      return fileName;
    }

    // based on http://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
    var copyRecursiveSync = function(src, dest) {
      var exists = fs.existsSync(src);
      var stats = exists && fs.statSync(src);
      var isDirectory = exists && stats.isDirectory();
      if (exists && isDirectory) {
        debug('creating directory', dest);
        fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(function(childItemName) {
          debug('copying from', src, 'into', dest, 'File:', childItemName);
          copyRecursiveSync(path.join(src, childItemName),
                            path.join(dest, childItemName));
        });
      } else {
        var destinationFile =  applyReplacements(dest, options.replace || {});
        var output = fs.readFileSync(src).toString();
        if (options.engine === 'ejs') {
          output = ejs.render(output, options.data);
        }
        fs.writeFileSync(destinationFile, output);
      }
    };

    mkdirp(path.dirname(destinationFolder), function(err){
      if (err) {
        return cb(err);
      }

      copyRecursiveSync(templateSourceFolder, destinationFolder);
      cb();
    });
  }

};