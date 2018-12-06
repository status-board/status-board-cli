import { Command, flags } from '@oclif/command';

export default class Install extends Command {
  public static description = 'install package dependencies';

  public static flags = {
    help: flags.help({ char: 'h' }),
  };

  public async run() {
    const { flags } = this.parse(Install);

    this.log('Generate was called with:');
  }
}
