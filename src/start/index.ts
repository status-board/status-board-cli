import chalk from 'chalk';
import { start as startLogic } from './logic';

/**
 * When run in a project's base directory, starts the Status Board server.
 *
 * @params args[0] port (optional)
 * @params args --jobFilter filter by job (optional)
 * @params args --dashboardFilter filter by dashboard (optional)
 */
export function start(args: any, options: any, logger: any, callback: any) {
  const port = isNaN(args.port) ? 3000 : args.port;
  const statusBoardOptions: any = { port, filters: {}, install: true };
  // const argsOptimistic = require('optimist')(args).argv;

  if (options.noinstall) {
    logger('Do not install dependencies');
    statusBoardOptions.install = false;
  }

  if (options.job) {
    logger(`Loading jobs matching ${chalk.yellow(options.job)} only`);
    statusBoardOptions.filters.jobFilter = options.job;
  }

  if (options.dashboard) {
    logger(`Loading dashboards matching ${chalk.yellow(options.dashboard)} only`);
    statusBoardOptions.filters.dashboardFilter = options.dashboard;
  }
  logger(chalk.gray('\nStarting server...'));

  startLogic(statusBoardOptions, logger, (err: any) => {
    callback(err);
  });
}
