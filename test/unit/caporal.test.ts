import caporal from '../../src/caporal';

jest.mock('jsonfile', () => {
  return {
    readFileSync: jest.fn(() => {
      return {
        description: 'Mocked description',
        version: '1.0.0',
      };
    }),
  };
});

describe('src/index.ts', () => {
  it('should match our snapshot', () => {
    expect(caporal).toMatchSnapshot();
  });
});
