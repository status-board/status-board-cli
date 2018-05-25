import { generate as generateLogic } from './logic';
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
