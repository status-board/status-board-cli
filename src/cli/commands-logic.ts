import * as async from 'async';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import statusBoard from 'status-board';
import * as _ from 'underscore';

import { areValidPathElements, isPathContainedInRoot } from '../helpers';
import { getByPackage } from '../item-manager';
import { installDependencies } from '../package-dependency-manager';
import { scaffold } from './scaffolding';

function directoryHasAtlasBoardProject(dir: any) {
  // The project should have these items
  const requiredItems = ['packages', 'package.json', 'config'];
  return requiredItems.every((item) => {
    return fs.existsSync(path.join(dir, item));
  });
}

const validNewDirectoryExp = /^[a-zA-Z0-9_-]*$/;

// tslint:disable-next-line max-line-length
export function generate(projectDir: any, packages: any, itemType: any, itemName: any, logger: any, callback: any) {

  if (!areValidPathElements([itemType, itemName])) {
    return callback('invalid input');
  }

  const templateFolder = path.join(__dirname, '../..', 'templates', 'new-components');

  // Assert valid parameter usage
  const itemsToGenerate = ['widget', 'dashboard', 'job'];
  if (itemsToGenerate.indexOf(itemType) === -1) {
    // tslint:disable-next-line max-line-length
    return callback('Invalid generator ' + itemType + '\nUse one of: ' + itemsToGenerate.join(', '));
  }

  // Assert a project already exists here
  if (!directoryHasAtlasBoardProject(projectDir)) {
    // tslint:disable-next-line max-line-length
    return callback('It seems that no project exists here yet. Please navigate to your project\'s root directory, or generate one first.');
  }

  // Assert name given
  if (!itemName) {
    // tslint:disable-next-line max-line-length
    return callback('ERROR: No ' + itemType + ' name provided. Please try again with a name after the generate parameter');
  }

  // Assert no such item exists there yet
  const destPackageLocation = path.join(projectDir, 'packages', packages);

  let options = {};
  let target;
  let src;

  if (itemType === 'dashboard') { // all dashboards files are stored within the dashboards folder
    src = path.join(templateFolder, 'dashboard', 'default.json');
    target = path.join(destPackageLocation, 'dashboards', itemName + '.json');
  } else {

    src = path.join(templateFolder, itemType);
    target = path.join(path.join(destPackageLocation, itemType + 's'), itemName);

    options = {
      data: {
        name: itemName,
      },
      engine: 'ejs',
      replace: {
        'default.js': itemName + '.js',
        'widget.': itemName + '.',
      },
    };
  }

  if (fs.existsSync(target)) {
    return callback('ERROR: This ' + itemType + ' already seems to exist at ' + target);
  }

  logger.log('\nCreating new %s at %s...', itemType, target);
  scaffold(src, target, options, callback);
  logger.log(chalk.green('SUCCESS !!') + '\n');
}

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

export function list(packagesPath: any, logger: any, callback: any) {
  packagesPath = Array.isArray(packagesPath) ? packagesPath : [packagesPath];
  async.map(_.unique(packagesPath), (packagePath: any, cb: any) => {
    const list: any = { package: packagePath };
    getByPackage(packagePath, 'widgets', '.js', (err: any, packagesWidgetList: any) => {
        if (err) {
          return cb(err);
        }
        list.widgets = packagesWidgetList;
        getByPackage(packagePath, 'jobs', '.js', (err: any, packagesJobList: any) => {
          if (err) {
            return cb(err);
          }
          list.jobs = packagesJobList;
          cb(null, (list.widgets.length && list.jobs.length) ? list : null);
        });
      });
  },
            (err: any, results: any) => {
              callback(err, _.compact(results));
            },
  );
}

export function start(options: any, logger: any, callback: any) {
  if (!directoryHasAtlasBoardProject(process.cwd())) {
    // tslint:disable-next-line max-line-length
    return callback('I couldn\'t find a valid AtlasBoard dashboard. Try generating one with `atlasboard new DASHBOARDNAME`.');
  }

  // start Status Board
  statusBoard(options, callback);
}

export function install(options: any, logger: any, callback: any) {
  const packagesLocalFolder = path.join(process.cwd(), '/packages');
  installDependencies([packagesLocalFolder], callback);
}
