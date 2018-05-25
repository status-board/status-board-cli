import chalk from 'chalk';
import * as path from 'path';
import sanitizeFilename = require('sanitize-filename');
import { newProject as newProjectLogic } from './logic';

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
  const newDirectory = sanitizeFilename(args[0]);
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
