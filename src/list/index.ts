import chalk from 'chalk';
import * as path from 'path';
import { list as listLogic } from './logic';

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
