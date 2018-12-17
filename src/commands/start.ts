import { Command, flags } from '@oclif/command';
import { start } from '../start';

export default class Start extends Command {
  public static description = 'starts Status Board\'s server';

  public static flags = {
    dashboard: flags.string({
      char: 'd',
      description: 'loads only dashboards matching',
    }),
    job: flags.string({
      char: 'j',
      description: 'runs only jobs matching \'myjob\'',
    }),
    noinstall: flags.boolean({
      char: 'n',
      description: 'skips npm package install (faster startup)',
    }),

  };

  public static args = [
    {
      description: 'runs Status Board in port',
      name: 'port',
    },
  ];

  public async run() {
    const { args, flags } = this.parse(Start);
    const options = {};

    this.log('Generate was called with:');
    this.log(`Component: ${args.component}`);
    this.log(`Name: ${args.name}`);
    this.log('Command \'start\' called with:');
    this.log('arguments: %j', args);
    this.log('flags: %j', flags);
    this.log('options: %j', options);
    start(args, flags, this.log, (error: any) => {
      if (error) {
        throw Error(error);
      }
    });
  }
}
