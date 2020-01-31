/*eslint-env mocha*/

import expect from 'chai/interface/expect';
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
    return makeCanProvide({ dependencyIndex: { dep1: [] } })(['dep1']).then(
      result => expect(result).to.be.true
    );
  });
  it('should return false if window.navigator.onLine is false', () => {
    fakeOnLineValue(false);
    return makeCanProvide({ dependencyIndex: { dep1: [] } })(['dep1']).then(
      result => expect(result).to.be.false
    );
  });
  it('should return true if window.navigator.onLine is undefined', () => {
    //eslint-disable-next-line no-undefined
    fakeOnLineValue(undefined);
    return makeCanProvide({ dependencyIndex: { dep1: [] } })(['dep1']).then(
      result => expect(result).to.be.true
    );
  });
  it('should return false if the requsted dpendency is not in the given index', () => {
    return makeCanProvide({ dependencyIndex: {} })(['dep1']).then(
      result => expect(result).to.be.false
    );
  });
  it('should return if the origin is localhost even if window.navigator.onLine is false', () => {
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
    return Promise.all(
      origins.map(origin =>
        makeCanProvide({ origin })(['dep1']).then(
          result => expect(result).to.be.true
        )
      )
    );
  });
  it('should return true if no dependencies were passed', () => {
    fakeOnLineValue(false);
    return makeCanProvide({ dependencyIndex: { dep1: [] } })().then(
      result => expect(result).to.be.true
    );
  });
});
