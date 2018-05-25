import { install as installLogic } from './logic';

/**
 * Install the packages dependencies
 */
export function install(args: any, options: any, logger: any, callback: any) {
  // check for the right arguments
  return installLogic({}, logger, (err: any) => {
    callback(err);
  });
}
