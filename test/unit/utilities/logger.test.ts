import { Console } from 'console';
import { logger } from '../../../src/utilities'

describe('Logger', () => {
  test('Logger should be a instance of Console', () => {
    expect(logger).toBeInstanceOf(Console);
  });
});
