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
    const { args } = this.parse(New);
    const options = {};

    this.log('Generate was called with:');
    this.log(`Component: ${args.component}`);
    this.log(`Name: ${args.name}`);

    this.log('Command \'new\' called with:');
    this.log('arguments: %j', args);
    this.log('options: %j', options);
    newProject(args, options, this.log, (error?: string) => {
      if (error) {
        throw Error(error);
      }
    });
  }
}
