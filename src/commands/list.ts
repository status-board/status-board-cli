import { Command, flags } from '@oclif/command';

export default class List extends Command {
  public static description = 'lists all available components (widgets or jobs) among all packages';

  public async run() {
    const { args, flags } = this.parse(List);

    const name = flags.name || 'world';
    this.log(`hello ${name} from src/commands/list.ts`);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}
