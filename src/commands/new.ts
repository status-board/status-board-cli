import { Command, flags } from '@oclif/command';
import { newProject } from '../new-project';

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
    const { args, flags } = this.parse(New);

    newProject(args, flags, this.log, (error?: string) => {
      if (error) {
        throw Error(error);
      }
    });
  }
}
