var fs = require('fs');
var path = require('path');
var async = require('async');
var _ = require('underscore');
var helpers = require('./helpers');
var logger = require('./logger')();

/**
 * Filters will be applied to a certain type to decide if that
 * item should be included in the list to be returned.
 * You can match extensions, do sanity checks (valid JSON), etc.
 */

var filters = {
  "dashboards": function (dashboardPath) {
    try {
      var contentJSON = JSON.parse(fs.readFileSync(dashboardPath));
      return (contentJSON.enabled !== false);
    }
    catch (e) {
      logger.error('## ERROR ## ' + dashboardPath + ' has an invalid format or file doesn\'t exist\n');
      return false;
    }
  }
};

module.exports = {

  /**
   * Returns relative path to packages path based on item type.
   * The main purpose of this function is to be able to handle the different way
   * widgets and jobs paths are resolved compared to the way dashboards paths are.
   *
   * @param {string} name item name to match. i.e: widget1
   * @param {string} itemType item type in plural. ('dashboards', 'jobs', 'widgets')
   * @param {string} extension : file extension
   *
   * @return {string} relative path to item: jobs/job1/job1.js
   */

  resolveLocation: function (name, itemType, extension) {
    var useDirectoryLevel = ((itemType === "widgets") || (itemType === "jobs"));
    if (useDirectoryLevel) {
      // jobs/job1/job1.js
      return path.join(itemType, name, name + extension);
    }
    else {
      // dashboards/dashboard.json
      return path.join(itemType, name + extension);
    }
  },

  /**
   * Get the items that match the particular filter.
   *
   * @param {[string]} items : list of file paths
   * @param {string} name item name to match. It can be namespaced. i.e: atlassian#widget1, widget1
   * @param {string} itemType item type in plural. ('dashboards', 'jobs', 'widgets')
   * @param {string} extension : filter result by extension
   */

  resolveCandidates: function (items, name, itemType, extension) {
    var searchCriteria = "";
    if (name.indexOf("#") > -1) {
      var packageName = name.split("#")[0];
      var itemParsedName = name.split("#")[1];
      // package/jobs/job1/job1.js
      searchCriteria = path.join(packageName, this.resolveLocation(itemParsedName, itemType, extension));
    }
    else {
      // jobs/job1/job1.js
      searchCriteria = this.resolveLocation(name, itemType, extension);
    }

    searchCriteria = path.sep + searchCriteria;

    return items.filter(function (item) {
      return item.indexOf(searchCriteria) > -1;
    });
  },

  /**
   * Return first candidate found matching name, type and extension
   *
   * @param {[string]} packagesPath : list of directories to find packages in.
   * @param {string} itemName item name to match. It can be namespaced. i.e: atlassian#widget1, widget1
   * @param {string} itemType item type in plural. ('dashboards', 'jobs', 'widgets')
   * @param {string} extension : filter result by extension
   */

  getFirst: function (packagesPath, itemName, itemType, extension, callback) {
    var thiz = this;
    this.get(packagesPath, itemType, extension, function (err, items) {
      if (err) {
        return callback(err);
      }

      var candidates = thiz.resolveCandidates(items, itemName, itemType, extension);
      callback(null, candidates.length ? candidates[0] : null);
    });
  },


  /**
   * Return list of items found in any package within packagesPath
   *
   * @param {[string]} packagesPath : list of directories to find packages in.
   * @param {string} itemType item type in plural. ('dashboards', 'jobs', 'widgets')
   * @param {string} extension : filter result by extension
   */

  get: function (packagesPath, itemType, extension, callback) {
    this.getByPackage(packagesPath, itemType, extension, function (err, results) {
      if (err) {
        return callback(err);
      }
      var items = [];
      results.forEach(function (package) {
        items = items.concat(package.items);
      });
      callback(null, items);
    });
  },

  /**
   * Return list of items found in any package within packagesPath
   * Items are returned separated by package
   *
   * @param {[string]} packagesPath : list of directories to find packages in.
   * @param {string} itemType item type in plural. ('dashboards', 'jobs', 'widgets')
   * @param {string} extension : filter result by extension
   */

  getByPackage: function (packagesPath, itemType, extension, callback) {

    if (!Array.isArray(packagesPath)) {
      packagesPath = [packagesPath];
    }

    function readItemsFromPackageDir(dir, cb) {
      var package = {dir: dir};

      var itemDir = path.join(dir, itemType);
      if (!fs.existsSync(itemDir)) {
        package.items = [];
        return cb(null, package);
      }

      // this functions parses:
      // - packages/default/<itemType>/*
      // - packages/otherpackages/<itemType>/*
      // for dashboards, or:
      // - packages/default/<itemType>/*/*.js
      // - packages/otherpackages/<itemType>/*/*.js
      // for jobs and widgets
      fs.readdir(itemDir, function (err, items) {
        if (err) {
          return cb(err);
        }

        var selectedItems = [];
        items.forEach(function (item_name) {
          var item = path.join(itemDir, item_name);
          var stat = fs.statSync(item);
          if (stat.isDirectory()) {
            // /job/job1/job1.js
            item = path.join(item, item_name + extension);
          }

          if (path.extname(item) === extension) {
            if (fs.existsSync(item)) {
              selectedItems.push(item);
            }
          }
        });

        if (filters[itemType]) { // change to use custom filters for itemType
          selectedItems = selectedItems.filter(filters[itemType]);
        }

        package.items = selectedItems;
        return cb(null, package);
      });
    }


    // this function read all the packages from the provided directory packagesPath:
    // - packages/default/*
    // - packages/otherpackages/*
    // and calls readItemsFromPackageDir for every one of them

    function fillPackages(packagesPath, cb) {
      fs.readdir(packagesPath, function (err, allPackagesDir) {
        if (err) {
          return cb(err);
        }

        // convert to absolute path
        allPackagesDir = allPackagesDir.map(function (partialDir) {
          return path.join(packagesPath, partialDir);
        });

        // get only valid directories
        allPackagesDir = allPackagesDir.filter(function (dir) {
          return fs.statSync(dir).isDirectory();
        });

        // read items from every package and flatten results
        async.map(allPackagesDir, readItemsFromPackageDir, function (err, results) {
          if (err) {
            return cb(err);
          }
          cb(null, _.flatten(results));
        });
      });
    }

    // process all package paths
    async.map(packagesPath.filter(fs.existsSync), fillPackages, function (err, results) {
      if (err) {
        return callback(err);
      }
      callback(null, _.flatten(results));
    });
  }
};