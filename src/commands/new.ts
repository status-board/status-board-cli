import { Command, flags } from '@oclif/command';

export default class New extends Command {
  public static description = 'generates a new dashboard project';

  public static flags = {
    help: flags.help({ char: 'h' }),
  };

  public static args = [
    {
      description: 'App to deploy',
      name: 'app',
    },
    {
      description: 'Environment to deploy on',
      name: 'env',
    },
  ];

  public async run() {
  }
}
