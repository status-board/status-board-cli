import { expect, test } from '@oclif/test';

describe('list', () => {
  test
    .stdout()
    .command(['list'])
    .it('runs hello', (ctx) => {
      expect(ctx.stdout).to.contain('hello world');
    });
});
