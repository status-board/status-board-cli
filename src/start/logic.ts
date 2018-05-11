import { directoryHasAtlasBoardProject } from '../utilities';

export function start(options: any, logger: any, callback: any) {
  if (!directoryHasAtlasBoardProject(process.cwd())) {
    // tslint:disable-next-line max-line-length
    return callback('I couldn\'t find a valid AtlasBoard dashboard. Try generating one with `atlasboard new DASHBOARDNAME`.');
  }

  // start Status Board
  // statusBoard(options, callback);
}
