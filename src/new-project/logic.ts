import * as fs from 'fs';
import * as path from 'path';
import {
  directoryHasStatusBoardProject,
  isPathContainedInRoot,
  scaffold,
} from '../utilities';

const validNewDirectoryExp = /^[a-zA-Z0-9_-]*$/;

type logger = (message?: string, ...args: any[]) => void;
type callback = (error?: string) => void;

export function newProject(srcDir: string, destDir: string, logger: logger, callback: callback) {

  // Check for valid directory name
  const dirName = path.basename(destDir);
  if (!dirName.match(validNewDirectoryExp)) {
    return callback('Invalid wallboard name');
  }

  if (!isPathContainedInRoot(destDir, process.cwd())) {
    return callback('invalid directory');
  }

  logger('\n  Generating a new Status Board project at %s...', destDir);

  const parentDir = path.dirname(destDir);

  if (directoryHasStatusBoardProject(parentDir)) {
    // tslint:disable-next-line max-line-length
    return callback('You can not create an Status Board inside a directory containing an Status Board (at least we think you shouldn\'t)');
  }

  if (fs.existsSync(destDir)) {
    // tslint:disable-next-line max-line-length
    return callback(`There is already a directory here called ${destDir}. Please choose a new name.`);
  }

  logger('  Creating new wallboard ...');
  const options = {
    data: {
      name: dirName,
    },
    engine: 'ejs',
  };
  scaffold(srcDir, destDir, options, callback);
}
