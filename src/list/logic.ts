import * as _ from 'underscore';
import * as async from 'async';
import { getByPackage } from '../item-manager';

export function list(packagesPath: any, logger: any, callback: any) {
  const packagePath = Array.isArray(packagesPath) ? packagesPath : [packagesPath];
  async.map(
    _.unique(packagePath),
    (pkgPath: any, cb: any) => {
      const packageList: any = { package: pkgPath };
      getByPackage(pkgPath, 'widgets', '.js', (err: any, packagesWidgetList: any) => {
        if (err) {
          return cb(err);
        }
        packageList.widgets = packagesWidgetList;
        getByPackage(pkgPath, 'jobs', '.js', (error: any, packagesJobList: any) => {
          if (error) {
            return cb(error);
          }
          packageList.jobs = packagesJobList;
          cb(null, (packageList.widgets.length && packageList.jobs.length) ? packageList : null);
        });
      });
    },
    (err: any, results: any) => {
      callback(err, _.compact(results));
    },
  );
}
