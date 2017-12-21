import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

export default function showHelp(): void {
  const projectPackageJson = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../..', 'package.json'),
    ).toString(),
  );
  console.log([
    '\n  Atlasboard Version ' + chalk.yellow(projectPackageJson.version) + '\n',
    '  usage: atlasboard [' + chalk.yellow('command') + '] [options]\n',
    '  LIST OF AVAILABLE COMMANDS:\n',
  ].join('\n'));
}
