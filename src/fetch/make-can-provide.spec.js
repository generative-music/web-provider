import makeCanProvide from './make-can-provide';

const fakeOnLineValue = value => {
  Object.defineProperty(window.navigator, 'onLine', {
    get: () => value,
    configurable: true,
  });
};

describe('fetch/canProvide', () => {
  it('should return true if window.navigator.onLine is true', () => {
    fakeOnLineValue(true);
    return makeCanProvide({ dep1: ['./some/url'] })(['dep1']).then(
      result => expect(result).to.be.true
    );
  });
  it('should return false if window.navigator.onLine is false', () => {
    fakeOnLineValue(false);
    return makeCanProvide({ dep1: ['./some/url'] })(['dep1']).then(
      result => expect(result).to.be.false
    );
  });
  it('should return true if window.navigator.onLine is undefined', () => {
    //eslint-disable-next-line no-undefined
    fakeOnLineValue(undefined);
    return makeCanProvide({ dep1: ['./some/url'] })(['dep1']).then(
      result => expect(result).to.be.true
    );
  });
  it('should return false if the requsted dependency is not in the given index', () => {
    fakeOnLineValue(true);
    return makeCanProvide({})(['dep1']).then(
      result => expect(result).to.be.false
    );
  });
  it('should return true for localhost urls even if window.navigator.onLine is false', () => {
    fakeOnLineValue(false);
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
    return makeCanProvide({
      dep1: [origins],
      dep2: origins.reduce((o, origin, i) => {
        o[i] = origin;
        return o;
      }, {}),
    })(['dep1']).then(result => expect(result).to.be.true);
  });
  it('should return true if no dependencies were passed', () => {
    fakeOnLineValue(false);
    return makeCanProvide({ dep1: [] })().then(
      result => expect(result).to.be.true
    );
  });
});
