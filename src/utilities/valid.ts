import { logger } from './logger';

export function valid(path: any) {
  if (!path) {
    return false;
  }

  // In case it is another type, like number
  const pathToCheck = path.toString();
  let malicious = false;

  if ((pathToCheck.indexOf('/') !== -1) || (pathToCheck.indexOf('\\') !== -1)) {
    malicious = true;
  }

  if (pathToCheck.indexOf('..') !== -1) {
    malicious = true;
  }

  if (pathToCheck.indexOf('\0') !== -1) {
    malicious = true;
  }

  if (malicious) {
    logger.log('Malicious path detected: %s', pathToCheck);
    return false;
  }
  return true;
}
