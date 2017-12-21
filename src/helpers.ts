import * as fs from 'fs';
import * as path from 'path';
import logger from './logger';

export function isPathContainedInRoot(pathDir: any, root: any) {
  if (typeof root !== 'string' || typeof pathDir !== 'string') {
    return false;
  }

  let pathDirCheck;

  if (pathDir[0] !== '/') {
    pathDirCheck = path.join(process.cwd(), pathDir);
  } else {
    pathDirCheck = pathDir;
  }

  return pathDirCheck.indexOf(root) === 0;
}

// tslint:disable-next-line no-shadowed-variable
function valid(path: any) {
  if (!path) {
    return false;
  }

  // In case it is another type, like number
  const pathToCheck = path.toString();
  let malicious = false;

  if ((pathToCheck.indexOf('/') !== -1) || (pathToCheck.indexOf('\\') !== -1)) {
    malicious = true;
  }

  if (pathToCheck.indexOf('..') !== -1) {
    malicious = true;
  }

  if (pathToCheck.indexOf('\0') !== -1) {
    malicious = true;
  }

  if (malicious) {
    logger().log('Malicious path detected: %s', pathToCheck);
    return false;
  }
  return true;
}

// -----------------------------------------
// Accepts a list of files or directory names
// Returns "" if invalid.
// -----------------------------------------
export function areValidPathElements(paths: any) {
  const pathsToCheck = Array.isArray(paths) ? paths : [paths];
  return pathsToCheck.every(valid);
}

export function getRndInt(min: any, max: any) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function readJSONFile(dashboardPath: any, cb: any) {
  fs.readFile(dashboardPath, (err: any, data: any) => {
    if (err) {
      return cb(err);
    }
    try {
      cb(null, JSON.parse(data.toString()));
    } catch (e) {
      cb(e);
    }
  });
}

// tslint:disable-next-line max-line-length no-shadowed-variable
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
