import { generate as generateLogic } from './logic';

const DEFAULT_PACKAGE_FOLDER = 'default';

/**
 * Generates an Status Board component
 *
 * @params args[0] item type: job, dashboard or widget
 * @params args[1] item name
 */
export function generate(args: any, options: any, logger: any, callback: any) {

  if (args.component.length < 1 && args.name.length < 1) {
    callback('Missing arguments. Please use "status-board generate widget <mywidget>"');
    return;
  }

  let packageFolder = DEFAULT_PACKAGE_FOLDER;

  const itemType = args.component;
  let itemName = args.name;
  if (itemName.indexOf('#') > -1) {
    // Package namespacing
    packageFolder = itemName.split('#')[0];
    itemName = itemName.split('#')[1];
  }

  return generateLogic(process.cwd(), packageFolder, itemType, itemName, logger, (error: any) => {
    callback(error);
  });
}
