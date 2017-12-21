import * as fs from 'fs';
import * as path from 'path';
import logger from './logger';

export function isPathContainedInRoot(pathDir: any, root: any) {
  if (typeof root !== 'string' || typeof pathDir !== 'string') {
    return false;
  }

  if (pathDir[0] !== '/') {
    pathDir = path.join(process.cwd(), pathDir);
  }
  return pathDir.indexOf(root) === 0;
}

// -----------------------------------------
// Accepts a list of files or directory names
// Returns "" if invalid.
// -----------------------------------------
export function areValidPathElements(paths: any) {

  function valid(path) {
    if (!path) {
      return false;
    }

    let malicius = false;
    path = path.toString(); // In case it is another type, like number

    if ((path.indexOf('/') !== -1) || (path.indexOf('\\') !== -1)) {
      malicius = true;
    }

    if (path.indexOf('..') !== -1) {
      malicius = true;
    }

    if (path.indexOf('\0') !== -1) {
      malicius = true;
    }

    if (malicius) {
      logger().log('Malicious path detected: %s', path);
      return false;
    }
    return true;
  }

  paths = Array.isArray(paths) ? paths : [paths];
  return paths.every(valid);
}

export function getRndInt(min: any, max: any) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function readJSONFile(dashboardPath: any, cb: any) {
  fs.readFile(dashboardPath, function read(err, data) {
    if (err) {
      return cb(err);
    }
    try {
      cb(null, JSON.parse(data));
    } catch (e) {
      cb(e);
    }
  });
}

export function getJSONFromFile(path: any, defaultValue: any, warnIfFileNotExists: any, warnIfFileIsInvalid: any) {
  try {
    if (!fs.existsSync(path)) {
      if (warnIfFileNotExists) {
        warnIfFileNotExists(path);
      }
      return defaultValue;
    }
    return JSON.parse(fs.readFileSync(path).toString());
  } catch (e) {
    if (warnIfFileIsInvalid) {
      warnIfFileIsInvalid(path, e);
    }
    return defaultValue;
  }
}
