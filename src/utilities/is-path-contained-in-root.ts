import * as path from 'path';

export function isPathContainedInRoot(pathDir: any, root: any) {
  if (typeof root !== 'string' || typeof pathDir !== 'string') {
    return false;
  }

  let pathDirCheck;

  if (pathDir[0] !== '/') {
    pathDirCheck = path.join(process.cwd(), pathDir);
  } else {
    pathDirCheck = pathDir;
  }

  return pathDirCheck.indexOf(root) === 0;
}
