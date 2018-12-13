import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { areValidPathElements, directoryHasStatusBoardProject, scaffold } from '../utilities';

export function generate(
  projectDir: any,
  packages: any,
  itemType: any,
  itemName: any,
  logger: any,
  callback: any,
) {

  if (!areValidPathElements([itemType, itemName])) {
    return callback('invalid input');
  }

  const templateFolder = path.join(__dirname, '../..', 'templates', 'new-components');

  // Assert valid parameter usage
  const itemsToGenerate = ['widget', 'dashboard', 'job'];
  if (itemsToGenerate.indexOf(itemType) === -1) {
    // tslint:disable-next-line max-line-length
    return callback(`Invalid generator ${itemType}
Use one of: ${itemsToGenerate.join(', ')}`);
  }

  // Assert a project already exists here
  if (!directoryHasStatusBoardProject(projectDir)) {
    // tslint:disable-next-line max-line-length
    return callback('It seems that no project exists here yet. Please navigate to your project\'s root directory, or generate one first.');
  }

  // Assert name given
  if (!itemName) {
    // tslint:disable-next-line max-line-length
    return callback(`ERROR: No ${itemType} name provided. Please try again with a name after the generate parameter`);
  }

  // Assert no such item exists there yet
  const destPackageLocation = path.join(projectDir, 'packages', packages);

  let options = {};
  let target;
  let src;

  if (itemType === 'dashboard') { // all dashboards files are stored within the dashboards folder
    src = path.join(templateFolder, 'dashboard', 'default.json');
    target = path.join(destPackageLocation, 'dashboards', `${itemName}.json`);
  } else {

    src = path.join(templateFolder, itemType);
    target = path.join(path.join(destPackageLocation, `${itemType}s`), itemName);

    options = {
      data: {
        name: itemName,
      },
      engine: 'ejs',
      replace: {
        'default.js': `${itemName}.js`,
        'widget.': `${itemName}.`,
      },
    };
  }

  if (fs.existsSync(target)) {
    return callback(`ERROR: This ${itemType} already seems to exist at ${target}`);
  }

  logger('\nCreating new %s at %s...', itemType, target);
  scaffold(src, target, options, callback);
  logger(`${chalk.green('SUCCESS !!')}
`);
}
