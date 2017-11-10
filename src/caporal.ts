import * as caporal from 'caporal';
import { readFileSync } from 'jsonfile';
import * as path from 'path';

const pkg = readFileSync(path.normalize(path.join(__dirname, '../package.json')));

caporal
  .version(pkg.version)
  .description(pkg.description)

  .command('example', 'hello world')
  .action((args, options, logger) => {
    logger.info('Command \'example\' called with:');
    logger.info('arguments: %j', args);
    logger.info('options: %j', options);
  });

export default caporal;
