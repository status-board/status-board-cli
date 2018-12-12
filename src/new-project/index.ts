import chalk from 'chalk';
import * as path from 'path';
import sanitizeFilename = require('sanitize-filename');
import { newProject as newProjectLogic } from './logic';

interface IArguments {
  app: string;
  env: string;
}

type logger = (message?: string, ...args: any[]) => void;
type callback = (error?: string) => void;

/**
 * Creates a new dashboard
 *
 * @params args[0] dashboard directory
 */
export function newProject(args: IArguments, options: any, logger: logger, callback: callback) {

  if (args.app.length < 1) {
    callback('Missing arguments. Please use "status-board new <mywallboard>"');
    return;
  }
  const newDirectory = sanitizeFilename(args.app);
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
    logger('  Installing npm dependencies...');
    child.on('error', () => {
      // tslint:disable-next-line max-line-length
      logger('\n  Error installing dependencies. Please run "npm install" inside the dashboard directory');
      callback('Error installing dependencies');
    });
    child.on('exit', () => {
      logger([
        `${chalk.green('\n  SUCCESS !!')}
`,
        `  New project "${chalk.yellow(newDirectory)}" successfully created. Now you can:
`,
        chalk.gray(`   1. cd ${newDirectory}`),
        chalk.gray('   2. npm install'),
        chalk.gray('   3. start your server with `npm run start` (or `node start.js`)'),
        `${chalk.gray('   4. browse http://localhost:3000')}
`,
        '   Optionally: import the Atlassian package (or any other package) by running:\n',
        chalk.gray('   git init'),
        // tslint:disable-next-line max-line-length
        chalk.gray('   git submodule add https://bitbucket.org/atlassian/atlasboard-atlassian-package packages/atlassian\n'),
      ].join('\n'));

      callback();
    });
  });
}
