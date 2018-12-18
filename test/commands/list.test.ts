import { test } from '@oclif/test';

import * as list from '../../src/list';

describe('list', () => {
  beforeEach(() => {
    jest.spyOn(list, 'list').mockImplementation(() => {
    });
  });

  test
    .stdout()
    .command(['list'])
    .it('runs hello', (ctx) => {
      expect(list.list).toHaveBeenCalled();
    });
});
