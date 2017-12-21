import chalk from 'chalk';
import * as path from 'path';
import * as sanitize from 'sanitize-filename';

import {
  generate as generateLogic,
  install as installLogic,
  list as listLogic,
  newProject as newProjectLogic,
  start as startLogic,
} from './commands-logic';

const DEFAULT_PACKAGE_FOLDER = 'default';

/**
 * Generates an Atlasboard component
 *
 * @params args[0] item type: job, dashboard or widget
 * @params args[1] item name
 */
export function generate(args: any, options: any, logger: any, callback: any) {

  if (args.length < 2) {
    callback('Missing arguments. Please use "atlasboard generate widget <mywidget>"');
    return;
  }

  let packageFolder = DEFAULT_PACKAGE_FOLDER;

  const itemType = args[0];
  let itemName = args[1];
  if (itemName.indexOf('#') > -1) {
    // Package namespacing
    packageFolder = itemName.split('#')[0];
    itemName = itemName.split('#')[1];
  }

  return generateLogic(process.cwd(), packageFolder, itemType, itemName, logger, (error: any) => {
    callback(error);
  });
}

/**
 * Creates a new dashboard
 *
 * @params args[0] dashboard directory
 */
export function newProject(args: any, options: any, logger: any, callback: any) {

  if (args.length < 1) {
    callback('Missing arguments. Please use "atlasboard new <mywallboard>"');
    return;
  }
  const newDirectory = sanitize(args[0]);
  const srcDir = path.join(__dirname, '../..', 'templates', 'new-components', 'project');
  const destDir = path.join(process.cwd(), newDirectory);
  return newProjectLogic(srcDir, destDir, logger, (error: any) => {
    if (error) {
      callback(error);
      return;
    }

    process.chdir(newDirectory);
    const isWindows = /^win/.test(process.platform);
    const npmCommand = isWindows ? 'npm.cmd' : 'npm';
    const childProcess = require('child_process');
    const child = childProcess.spawn(npmCommand, ['install', '--production'], { stdio: 'inherit' });
    logger.log('  Installing npm dependencies...');
    child.on('error', () => {
      // tslint:disable-next-line max-line-length
      logger.log('\n  Error installing dependencies. Please run "npm install" inside the dashboard directory');
      callback('Error installing dependencies');
    });
    child.on('exit', () => {
      logger.log([
        chalk.green('\n  SUCCESS !!') + '\n',
        '  New project "' + chalk.yellow(newDirectory) + '" successfully created. Now you can:\n',
        chalk.gray('   1. cd ' + newDirectory),
        chalk.gray('   2. npm install'),
        chalk.gray('   3. start your server with `atlasboard start` (or `node start.js`)'),
        chalk.gray('   4. browse http://localhost:3000') + '\n',
        '   Optionally: import the Atlassian package (or any other package) by running:\n',
        chalk.gray('   git init'),
        // tslint:disable-next-line max-line-length
        chalk.gray('   git submodule add https://bitbucket.org/atlassian/atlasboard-atlassian-package packages/atlassian\n'),
      ].join('\n'));

      callback();
    });
  });
}

/**
 * List of all Atlasboard components (widgets or jobs) within all available packages
 */
export function list(args: any, options: any, logger: any, callback: any) {

  function parse(packages: any) {
    logger.log('        Package "' + path.basename(packages.dir) + '":');
    packages.items.forEach((item: any) => {
      logger.log('          - ' + chalk.gray(path.basename(item, '.js')));
    });
  }

  const packagesLocalFolder = path.join(process.cwd(), '/packages');
  const packagesAtlasboardFolder = path.join(__dirname, '../../packages');
  const packagesPath = [packagesLocalFolder, packagesAtlasboardFolder];

  return listLogic(packagesPath, logger, (err: any, packages: any) => {
    if (err) {
      callback('Error reading package folder');
      return;
    }

    packages.forEach((packagez: any) => {
      logger.log('Path: ' + packagez.package + ':\n');
      logger.log(chalk.yellow('  - Widgets:'));
      packagez.widgets.forEach(parse);

      logger.log(chalk.yellow('  - Jobs:'));
      packagez.jobs.forEach(parse);
    });
    logger.log('');
    callback();
  });
}

/**
 * When run in a project's base directory, starts the AtlasBoard server.
 *
 * @params args[0] port (optional)
 * @params args --jobFilter filter by job (optional)
 * @params args --dashboardFilter filter by dashboard (optional)
 */
export function start(args: any, options: any, logger: any, callback: any) {
  const port = isNaN(args[0]) ? 3000 : args[0];
  const statusBoardOptions: any = { port, filters: {}, install: true };
  const argsOptimistic = require('optimist')(args).argv;

  if (argsOptimistic.noinstall) {
    statusBoardOptions.install = false;
  }

  if (argsOptimistic.job) {
    logger.log('Loading jobs matching ' + chalk.yellow(argsOptimistic.job) + ' only');
    statusBoardOptions.filters.jobFilter = argsOptimistic.job;
  }

  if (argsOptimistic.dashboard) {
    logger.log('Loading dashboards matching ' + chalk.yellow(argsOptimistic.dashboard) + ' only');
    statusBoardOptions.filters.dashboardFilter = argsOptimistic.dashboard;
  }
  logger.log(chalk.gray('\nStarting server...'));

  startLogic(statusBoardOptions, logger, (err: any) => {
    callback(err);
  });
}

/**
 * Install the packages dependencies
 */
export function install(args: any, options: any, logger: any, callback: any) {
  // check for the right arguments
  return installLogic({}, logger, (err: any) => {
    callback(err);
  });
}
