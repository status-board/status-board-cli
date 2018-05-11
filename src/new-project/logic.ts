import * as fs from 'fs';
import * as path from 'path';
import { directoryHasAtlasBoardProject, isPathContainedInRoot } from '../utilities';
import { scaffold } from '../utilities/scaffolding';

const validNewDirectoryExp = /^[a-zA-Z0-9_-]*$/;

export function newProject(srcDir: any, destDir: any, logger: any, callback: any) {

  // Check for valid directory name
  const dirName = path.basename(destDir);
  if (!dirName.match(validNewDirectoryExp)) {
    return callback('Invalid wallboard name');
  }

  if (!isPathContainedInRoot(destDir, process.cwd())) {
    return callback('invalid directory');
  }

  logger.log('\n  Generating a new AtlasBoard project at %s...', destDir.gray);

  const parentDir = path.dirname(destDir);

  if (directoryHasAtlasBoardProject(parentDir)) {
    // tslint:disable-next-line max-line-length
    return callback('You can not create an atlasboard inside a directory containing an atlasboard (at least we think you shouldn\'t)');
  }

  if (fs.existsSync(destDir)) {
    // tslint:disable-next-line max-line-length
    return callback('There is already a directory here called ' + destDir + '. Please choose a new name.');
  }

  logger.log('  Creating new wallboard ...');
  const options = {
    data: {
      name: dirName,
    },
    engine: 'ejs',
  };
  scaffold(srcDir, destDir, options, callback);
}
