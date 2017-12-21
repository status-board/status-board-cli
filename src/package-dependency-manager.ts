import * as async from 'async';
import * as fs from 'fs';
import * as path from 'path';
import * as readJson from 'read-package-json';
import * as semver from 'semver';
import * as _ from 'underscore';

export function installDependencies(packagesPath: any, callback: any) {
  // Process all available package containers
  // tslint:disable-next-line max-line-length
  async.map(packagesPath.filter(fs.existsSync), checkPackagesFolder, (mapError: any, results: any) => {
    if (mapError) {
      return callback(mapError);
    }

    const paths = _.flatten(results);

    async.eachSeries(paths, checkValidIfAtlasboardVersionForPackage, (eachSeriesError: any) => {
      if (eachSeriesError) {
        return callback(eachSeriesError);
      }

      async.eachSeries(paths, install, (error: any) => {
        callback(error);
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
  fs.readdir(packagesPath, (err: any, allPackagesDir: any) => {
    if (err) {
      return cb(err);
    }

    let processedPackagesDir;

    // convert to absolute path
    processedPackagesDir = allPackagesDir.map((partialDir: any) => {
      return path.join(packagesPath, partialDir);
    });

    // make sure we have package.json file
    processedPackagesDir = processedPackagesDir.filter((dir: any) => {
      return fs.statSync(dir).isDirectory() && fs.existsSync(dir + '/package.json');
    });

    cb(null, processedPackagesDir);
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
  getValidPackageJSON(pathPackage, (err: any, packageJson: any) => {
    if (err) {
      return callback(err);
    }

    getValidPackageJSON(atlasboardPackageJsonPath, (error: any, atlasboardPackageJson: any) => {
      if (error) {
        return callback('package.json not found for atlasboard at ' + atlasboardPackageJsonPath);
      }

      if (packageJson.engines && packageJson.engines.atlasboard) {
        const ok = semver.satisfies(atlasboardPackageJson.version, packageJson.engines.atlasboard);
        // tslint:disable-next-line max-line-length
        const msg = 'Atlasboard version does not satisfy package dependencies at ' + pathPackage + '. Please consider updating your version of atlasboard. Version required: ' + packageJson.engines.atlasboard + '. Atlasboard version: ' + atlasboardPackageJson.version;

        callback(ok ? null : msg);
      } else {
        // not atlasboard reference in engines node
        callback(null);
      }
    });
  });
}

/**
 * Install from package folder
 */
function install(pathPackageJson: any, callback: any) {
  // save current path
  const currPath = process.cwd();
  process.chdir(pathPackageJson);

  const isWindows = /^win/.test(process.platform);
  const npmCommand = isWindows ? 'npm.cmd' : 'npm';
  // tslint:disable-next-line max-line-length
  executeCommand(npmCommand, ['install', '--production', pathPackageJson], (err: any, code: any) => {
    if (err) {
      callback('Error installing dependencies for ' + pathPackageJson + '. err:' + err);
    } else {
      callback(code !== 0 ? 'error installing ' + pathPackageJson : null);
    }
  });

  // Restore path
  process.chdir(currPath);
}

/**
 * Executes a command in a childProcess
 */
function executeCommand(cmd: any, args: any, callback: any) {
  const childProcess = require('child_process');
  const child = childProcess.spawn(cmd, args, { stdio: 'inherit' });
  child.on('error', (err: any) => {
    callback(err);
  });
  child.on('exit', (code: any) => {
    callback(null, code);
  });
}
