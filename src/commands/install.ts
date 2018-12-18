import { Command, flags } from '@oclif/command';
import { install } from '../install';

export default class Install extends Command {
  public static description = 'install package dependencies';

  public static flags = {
    help: flags.help({ char: 'h' }),
  };

  public async run() {
    const { args, flags } = this.parse(Install);

    install(args, flags, this.log, (error: any) => {
      if (error) {
        throw Error(error);
      }
    });
  }
}
