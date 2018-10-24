import { expect, test } from '@oclif/test'

describe('generate', () => {
  test
    .stdout()
    .command(['generate', 'widget', 'jeff'])
    .it('should console log name', ctx => {
      expect(ctx.stdout).to.contain('jeff')
    })
});
