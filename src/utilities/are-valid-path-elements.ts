import { valid } from './valid';

// -----------------------------------------
// Accepts a list of files or directory names
// Returns "" if invalid.
// -----------------------------------------
export function areValidPathElements(paths: any) {
  const pathsToCheck = Array.isArray(paths) ? paths : [paths];
  return pathsToCheck.every(valid);
}
