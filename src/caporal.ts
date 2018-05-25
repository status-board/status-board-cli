import caporal = require('caporal');
import { readFileSync } from 'jsonfile';
import * as path from 'path';

import { generate } from './generate';
import { install } from './install';
import { list } from './list';
import { newProject } from './new-project';
import { start } from './start';

const pkg = JSON.parse(readFileSync(path.normalize(path.join(__dirname, '../package.json'))));

caporal
  .version(pkg.version)
  .description(pkg.description)

  /**
   * Generates an Status Board component
   *
   * @params args[0] item type: job, dashboard or widget
   * @params args[1] item name
   */
  .command('generate', 'generates a basic component of type widget, dashboard or job')
  .help('atlasboard generate widget mywidget')
  .argument('<component>', 'type of component', ['widget', 'dashboard', 'job'])
  .argument('<name>', 'name of component')
  .action((args: any, options: any, logger: any) => {
    logger.info('Command \'generate\' called with:');
    logger.info('arguments: %j', args);
    logger.info('options: %j', options);
    generate(args, options, logger, (error: any) => {
      if (error) {
        throw Error(error);
      }
    });
  })

  /**
   * Creates a new dashboard
   *
   * @params args[0] dashboard directory
   */
  .command('new', 'generates a new dashboard project')
  .help('atlasboard new mywallboard')
  .argument('<app>', 'App to deploy', /^myapp|their-app$/)
  .argument('[env]', 'Environment to deploy on', /^dev|staging|production$/, 'local')
  .action((args: any, options: any, logger: any) => {
    logger.info('Command \'new\' called with:');
    logger.info('arguments: %j', args);
    logger.info('options: %j', options);
    newProject(args, options, logger, (error: any) => {
      if (error) {
        throw Error(error);
      }
    });
  })

  /**
   * List of all Atlasboard components (widgets or jobs) within all available packages
   */
  .command('list', 'lists all available components (widgets or jobs) among all packages')
  .help('status-board list')
  .action((args: any, options: any, logger: any) => {
    logger.info('Command \'list\' called with:');
    logger.info('arguments: %j', args);
    logger.info('options: %j', options);
    list(args, options, logger, (error: any) => {
      if (error) {
        throw Error(error);
      }
    });
  })

  /**
   * When run in a project's base directory, starts the AtlasBoard server.
   *
   * @params args[0] port (optional)
   * @params args --jobFilter filter by job (optional)
   * @params args --dashboardFilter filter by dashboard (optional)
   */
  .command('start', 'starts Status Board\'s server')
  .help('my help for the order command')
  .argument('[port]', 'runs atlasboard in port')
  .option('--noinstall', 'skips npm package install (faster startup)')
  .option('--job <job>', 'runs only jobs matching \'myjob\'')
  .option('--dashboard <dashboard>', 'loads only dashboards matching')
  .action((args: any, options: any, logger: any) => {
    logger.info('Command \'start\' called with:');
    logger.info('arguments: %j', args);
    logger.info('options: %j', options);
    start(args, options, logger, (error: any) => {
      if (error) {
        throw Error(error);
      }
    });
  })

  /**
   * Install the packages dependencies
   */
  .command('install', 'install package dependencies')
  .help('status-board install')
  .action((args: any, options: any, logger: any) => {
    logger.info('Command \'install\' called with:');
    logger.info('arguments: %j', args);
    logger.info('options: %j', options);
    install(args, options, logger, (error: any) => {
      if (error) {
        throw Error(error);
      }
    });
  });

export default caporal;
