import { Command, flags } from '@oclif/command';
import { list } from '../list';

export default class List extends Command {
  public static description = 'lists all available components (widgets or jobs) among all packages';

  public async run() {
    const { args, flags } = this.parse(List);

    list(args, flags, this.log, (error: any) => {
      if (error) {
        throw Error(error);
      }
    });
  }
}
