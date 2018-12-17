import statusBoard from 'status-board';
import { directoryHasStatusBoardProject } from '../utilities';

export function start(options: any, logger: any, callback: any) {
  if (!directoryHasStatusBoardProject(process.cwd())) {
    // tslint:disable-next-line max-line-length
    return callback('I couldn\'t find a valid Status Board dashboard. Try generating one with `Status Board new DASHBOARDNAME`.');
  }

  // start Status Board
  statusBoard(options, callback);
}
