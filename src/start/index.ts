import chalk from 'chalk';
import { start as startLogic } from './logic';

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
