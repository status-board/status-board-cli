import * as path from 'path';
import * as semver from 'semver';
import { getValidPackageJSON } from './get-valid-package-json';

// in both test and production env will be located here.
const statusBoardPackageJsonPath = path.join(__dirname, '../../');

/**
 * Install from package folder
 */
export function checkValidIfStatusBoardVersionForPackage(pathPackage: string, callback: any) {
  getValidPackageJSON(pathPackage, (err: any, packageJson: any) => {
    if (err) {
      return callback(err);
    }

    getValidPackageJSON(statusBoardPackageJsonPath, (error: any, statusBoardPackageJson: any) => {
      if (error) {
        return callback(`package.json not found for Status Board at ${statusBoardPackageJsonPath}`);
      }

      if (packageJson.engines && packageJson.engines.statusboard) {
        const ok = semver.satisfies(
          statusBoardPackageJson.version,
          packageJson.engines.statusboard,
        );
        const msg = `
          Status Board version does not satisfy package dependencies at ${pathPackage}.
          Please consider updating your version of Status Board.
          Version required: ${packageJson.engines.statusboard}
          Status Board version: ${statusBoardPackageJson.version}
        `;

        callback(ok ? null : msg);
      } else {
        // not Status Board reference in engines node
        callback(null);
      }
    });
  });
}
