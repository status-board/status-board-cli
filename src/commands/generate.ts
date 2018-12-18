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
    const { args, flags } = this.parse(Generate);

    generate(args, flags, this.log, (error: any) => {
      if (error) {
        throw Error(error);
      }
    });
  }
}
