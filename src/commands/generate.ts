import { Command, flags } from '@oclif/command';
import { generate } from '../generate';

export default class Generate extends Command {
  public static description = 'generates a basic component of type widget, dashboard or job';

  public static flags = {
    help: flags.help({ char: 'h' }),
  };

  public static args = [
    {
      description: 'type of component',
      name: 'component',
      options: ['widget', 'dashboard', 'job'],
      required: true,
    },
    {
      description: 'name of component',
      name: 'name',
      required: true,
    },
  ];

  public async run() {
    const { args } = this.parse(Generate);
    const options = {};

    this.log('Generate was called with:');
    this.log(`Component: ${args.component}`);
    this.log(`Name: ${args.name}`);
    this.log('Command \'generate\' called with:');
    this.log('arguments: %j', args);
    this.log('options: %j', options);
    generate(args, options, this.log, (error: any) => {
      if (error) {
        throw Error(error);
      }
    });
  }
}
