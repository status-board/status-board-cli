import { Command, flags } from '@oclif/command';

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
      description: 'runs atlasboard in port',
      name: 'port',
    },
  ];

  public async run() {
    const { args, flags } = this.parse(Start);

    this.log('Generate was called with:');
    this.log(`Component: ${args.component}`);
    this.log(`Name: ${args.name}`);
  }
}
