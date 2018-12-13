import chalk from 'chalk';
import * as path from 'path';
import { list as listLogic } from './logic';

/**
 * List of all Status Board components (widgets or jobs) within all available packages
 */
export function list(args: any, options: any, logger: any, callback: any) {

  function parse(packages: any) {
    logger(`        Package "${path.basename(packages.dir)}":`);
    packages.items.forEach((item: any) => {
      logger(`          - ${chalk.gray(path.basename(item, '.js'))}`);
    });
  }

  const packagesLocalFolder = path.join(process.cwd(), '/packages');
  const packagesStatusBoardFolder = path.join(__dirname, '../../packages');
  const packagesPath = [packagesLocalFolder, packagesStatusBoardFolder];

  return listLogic(packagesPath, logger, (err: any, packages: any) => {
    if (err) {
      callback('Error reading package folder');
      return;
    }

    packages.forEach((packagez: any) => {
      logger(`Path: ${packagez.package}:
`);
      logger(chalk.yellow('  - Widgets:'));
      packagez.widgets.forEach(parse);

      logger(chalk.yellow('  - Jobs:'));
      packagez.jobs.forEach(parse);
    });
    logger('');
    callback();
  });
}
