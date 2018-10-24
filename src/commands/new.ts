import { Command, flags } from '@oclif/command';

export default class New extends Command {
  public static description = 'describe the command here';

  public static flags = {
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
  };

  public static args = [{ name: 'file' }];

  public async run() {
    const { args, flags } = this.parse(New);

    const name = flags.name || 'world';
    this.log(`hello ${name} from src/commands/new.ts`);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}
