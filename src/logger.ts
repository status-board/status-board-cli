import { Console } from 'console';

export default function () {
  return new Console(process.stdout, process.stderr);
}
