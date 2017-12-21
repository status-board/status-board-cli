import * as async from 'async';
import * as fs from 'fs';
import * as path from 'path';
import * as readJson from 'read-package-json';
import * as semver from 'semver';
import * as _ from 'underscore';

export function installDependencies(packagesPath: any, callback: any) {
  // Process all available package containers
  async.map(packagesPath.filter(fs.existsSync), checkPackagesFolder, function (err, results) {
    if (err) {
      return callback(err);
    }
    const paths = _.flatten(results);

    async.eachSeries(paths, checkValidIfAtlasboardVersionForPackage, function (err) {
      if (err) {
        return callback(err);
      }

      async.eachSeries(paths, install, function (err) {
        callback(err);
      });
    });
  });
}

// in both test and production env will be located here.
const atlasboardPackageJsonPath = path.join(__dirname, '../');

/**
 * Search for packages in the current folder
 */
function checkPackagesFolder(packagesPath: any, cb: any) {
  fs.readdir(packagesPath, function (err, allPackagesDir) {
    if (err) {
      return cb(err);
    }

    // convert to absolute path
    allPackagesDir = allPackagesDir.map(function (partialDir) {
      return path.join(packagesPath, partialDir);
    });

    // make sure we have package.json file
    allPackagesDir = allPackagesDir.filter(function (dir) {
      return fs.statSync(dir).isDirectory() && fs.existsSync(dir + '/package.json');
    });

    cb(null, allPackagesDir);
  });
}

/**
 * Install from package folder
 */
function getValidPackageJSON(pathPackage: any, callback: any) {
  readJson(pathPackage + '/package.json', callback);
}

/**
 * Install from package folder
 */
function checkValidIfAtlasboardVersionForPackage(pathPackage: any, callback: any) {
  getValidPackageJSON(pathPackage, function (err, packageJson) {
    if (err) {
      return callback(err);
    }

    getValidPackageJSON(atlasboardPackageJsonPath, function (err, atlasboardPackageJson) {
      if (err) {
        return callback('package.json not found for atlasboard at ' + atlasboardPackageJsonPath);
      }

      if (packageJson.engines && packageJson.engines.atlasboard) {
        const ok = semver.satisfies(atlasboardPackageJson.version, packageJson.engines.atlasboard);
        const msg = 'Atlasboard version does not satisfy package dependencies at ' +
          pathPackage + '. Please consider updating your version of atlasboard. Version required: ' +
          packageJson.engines.atlasboard + '. Atlasboard version: ' + atlasboardPackageJson.version;

        callback(ok ? null : msg);
      } else {
        callback(null); // not atlasboard reference in engines node
      }
    });
  });
}

/**
 * Install from package folder
 */
function install(pathPackageJson: any, callback: any) {
  const currPath = process.cwd(); // save current path
  process.chdir(pathPackageJson);

  const isWindows = /^win/.test(process.platform);
  const npmCommand = isWindows ? 'npm.cmd' : 'npm';

  executeCommand(npmCommand, ['install', '--production', pathPackageJson], function (err, code) {
    if (err) {
      callback('Error installing dependencies for ' + pathPackageJson + '. err:' + err);
    } else {
      callback(code !== 0 ? 'error installing ' + pathPackageJson : null);
    }
  });

  process.chdir(currPath); //restore path
}

/**
 * Executes a command in a childProcess
 */
function executeCommand(cmd: any, args: any, callback: any) {
  const childProcess = require('child_process');
  const child = childProcess.spawn(cmd, args, { stdio: 'inherit' });
  child.on('error', function (err) {
    callback(err);
  });
  child.on('exit', function (code) {
    callback(null, code);
  });
}
