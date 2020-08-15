import has from './has';

const overrideNavigatorOnLine = value => {
  Object.defineProperty(window.navigator, 'onLine', {
    get: () => value,
    configurable: true,
  });
};

describe('fetch.has', () => {
  it('should return true if window.navigator.onLine is true', () => {
    overrideNavigatorOnLine(true);
    return has({ dep1: ['./some/url'] }, ['dep1']).then(
      result => expect(result).to.be.true
    );
  });
  it('should return false if window.navigator.onLine is false', () => {
    overrideNavigatorOnLine(false);
    return has({ dep1: ['./some/url'] }, ['dep1']).then(
      result => expect(result).to.be.false
    );
  });
  it('should return false if the requsted dependency is not in the given index', () => {
    overrideNavigatorOnLine(true);
    return has({}, ['dep1']).then(result => expect(result).to.be.false);
  });
  it('should return true for localhost urls even if window.navigator.onLine is false', () => {
    overrideNavigatorOnLine(false);
    const origins = ['http', 'https'].reduce((allOrigins, protocol) => {
      const origin = `${protocol}://localhost`;
      const withPort = `${origin}:69`;
      return allOrigins.concat([
        origin,
        `${origin}/`,
        withPort,
        `${withPort}/`,
      ]);
    }, []);
    return has(
      {
        dep1: [origins],
        dep2: origins.reduce((o, origin, i) => {
          o[i] = origin;
          return o;
        }, {}),
      },
      ['dep1']
    ).then(result => expect(result).to.be.true);
  });
  it('should return true if no dependencies were passed', () => {
    overrideNavigatorOnLine(false);
    return has({ dep1: [] }).then(result => expect(result).to.be.true);
  });
});
