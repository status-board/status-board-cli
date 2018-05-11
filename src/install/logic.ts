import * as path from 'path';
import { installDependencies } from '../package-dependency-manager';

export function install(options: any, logger: any, callback: any) {
  const packagesLocalFolder = path.join(process.cwd(), '/packages');
  installDependencies([packagesLocalFolder], callback);
}
