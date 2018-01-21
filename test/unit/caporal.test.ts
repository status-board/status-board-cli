import caporal from '../../src/caporal';

jest.mock('jsonfile', () => {
  return {
    readFileSync: jest.fn(() => {
      const fakeJson = {
        "version": "1.0.0",
        "description": "Mocked description"
      };
      return JSON.stringify(fakeJson);
    }),
  };
});

describe('src/index.ts', () => {
  it('should match our snapshot', () => {
    expect(caporal).toMatchSnapshot();
  });
});
