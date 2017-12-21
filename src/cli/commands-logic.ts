#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var scaffolding = require('./scaffolding');
var itemManager = require('../item-manager');
var async = require('async');
var _ = require('underscore');
var helpers = require('../helpers');
var packageDependencyManager = require('../package-dependency-manager');
var atlasboard = require('../atlasboard');

require('colors');

function directoryHasAtlasBoardProject(dir){
  var requiredItems = ["packages", "package.json", "config"]; //the project should have these items
  return requiredItems.every(function (item) { return fs.existsSync(path.join(dir, item));});
}

var validNewDirectoryExp = /^[a-zA-Z0-9_-]*$/;

module.exports = {

  generate: function (projectDir, package, itemType, itemName, callback){

    if (!helpers.areValidPathElements([itemType, itemName])){
      return callback('invalid input');
    }

    var templateFolder = path.join(__dirname, "../..", "templates", "new-components");

    //Assert valid parameter usage
    var itemsToGenerate = ["widget", "dashboard", "job"];
    if (itemsToGenerate.indexOf(itemType) == -1) {
      return callback("Invalid generator " + itemType + "\nUse one of: " + itemsToGenerate.join(", "));
    }

    //Assert a project already exists here
    if (!directoryHasAtlasBoardProject(projectDir)){
      return callback("It seems that no project exists here yet. Please navigate to your project's root directory, or generate one first.");
    }

    //Assert name given
    if (!itemName) {
      return callback("ERROR: No " + itemType + " name provided. Please try again with a name after the generate parameter");
    }

    //Assert no such item exists there yet
    var destPackageLocation = path.join(projectDir, "packages", package);

    var options = {};
    var target, src;

    if (itemType === 'dashboard'){ // all dashboards files are stored within the dashboards folder
      src = path.join(templateFolder, 'dashboard', 'default.json');
      target = path.join(destPackageLocation, 'dashboards', itemName + '.json');
    }
    else {

      src = path.join(templateFolder, itemType);
      target = path.join(path.join(destPackageLocation, itemType + "s"), itemName);

      options = {
        engine : 'ejs',
        data : {
          name: itemName
        },
        replace: {
          "widget.": itemName + '.',
          "default.js": itemName + '.js'
         }
      };
    }

    if (fs.existsSync(target)) {
      return callback ("ERROR: This " + itemType + " already seems to exist at " + target);
    }

    console.log("\nCreating new %s at %s...", itemType, target);
    scaffolding.scaffold(src, target, options, callback);
    console.log("SUCCESS !!".green + '\n');
  },

  newProject: function(srcDir, destDir, callback) {

    //check for valid directory name
    var dirName = path.basename(destDir);
    if (!dirName.match(validNewDirectoryExp)){
      return callback('Invalid wallboard name');
    }

    if (!helpers.isPathContainedInRoot(destDir, process.cwd())){
      return callback('invalid directory');
    }

    console.log("\n  Generating a new AtlasBoard project at %s...", destDir.gray);

    var parentDir = path.dirname(destDir);

    if (directoryHasAtlasBoardProject(parentDir)){
      return callback("You can not create an atlasboard inside a directory containing an atlasboard (at least we think you shouldn't)");
    }

    if (fs.existsSync(destDir)) {
      return callback("There is already a directory here called " + destDir + ". Please choose a new name.");
    }

    console.log("  Creating new wallboard ...");
    var options = {
      engine : 'ejs',
      data : {
        name : dirName
      }
    };
    scaffolding.scaffold(srcDir, destDir, options, callback);
  },

  list : function(packagesPath, callback){
    packagesPath = Array.isArray(packagesPath) ? packagesPath : [packagesPath];
    async.map(_.unique(packagesPath), function(packagePath, cb){
      var list = { package : packagePath};
      itemManager.getByPackage(packagePath, "widgets", ".js", function(err, packagesWidgetList){
        if (err) {return cb(err);}
        list.widgets = packagesWidgetList;
        itemManager.getByPackage(packagePath, "jobs", ".js", function(err, packagesJobList){
          if (err) {return cb(err);}
          list.jobs = packagesJobList;
          cb(null, (list.widgets.length && list.jobs.length) ? list : null);
        });
      });
    }, function (err, results){
      callback(err, _.compact(results));
    });
  },

  start : function(options, callback){
    if (!directoryHasAtlasBoardProject(process.cwd())){
      return callback("I couldn't find a valid AtlasBoard dashboard. Try generating one with `atlasboard new DASHBOARDNAME`.");
    }

    // start AtlasBoard
    atlasboard(options, callback);
  },

  install : function(options, callback) {
    var packagesLocalFolder = path.join(process.cwd(), "/packages");
    packageDependencyManager.installDependencies([packagesLocalFolder], callback);
  }
};
