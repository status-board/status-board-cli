import { Command, flags } from '@oclif/command';
import { list } from '../list';

export default class List extends Command {
  public static description = 'lists all available components (widgets or jobs) among all packages';

  public async run() {
    const { args, flags } = this.parse(List);
    const options = {};

    const name = flags.name || 'world';
    this.log(`hello ${name} from src/commands/list.ts`);
    this.log('Command \'list\' called with:');
    this.log('arguments: %j', args);
    this.log('options: %j', options);
    list(args, options, this.log, (error: any) => {
      if (error) {
        throw Error(error);
      }
    });
  }
}
