import openCache from './open-cache';
import makeCanProvide from './make-can-provide';

const DEPENDENCY_URLS = ['dep1/url1', 'dep1/url2', 'dep2/url1', 'dep2/url2'];

describe('canProvide', () => {
  before(() =>
    openCache().then(cache =>
      Promise.all(DEPENDENCY_URLS.map(url => cache.put(url, new Response())))
    )
  );

  it("shouldn't call canProvideFresh for empty arguments", () => {
    const canProvideFresh = () => {
      throw new Error('canProvideFresh called');
    };
    const canProvide = makeCanProvide({}, canProvideFresh);
    return Promise.all([canProvide(), canProvide([])]).then(results => {
      expect(results.every(result => result)).to.be.true;
    });
  });

  it("shouldn't pass cached dependencies to canProvideFresh", () => {
    const canProvideFresh = dependencyNames => {
      expect(dependencyNames).to.be.empty;
      canProvideFresh.called = true;
      return true;
    };
    const canProvide = makeCanProvide(
      {
        dep1: { url1: 'dep1/url1', url2: 'dep1/url2' },
        dep2: ['dep2/url1', 'dep2/url2'],
      },
      canProvideFresh
    );
    return canProvide(['dep1', 'dep2']).then(result => {
      expect(result).to.be.true;
      expect(canProvideFresh.called).to.be.true;
    });
  });

  it('should defer to canProvideFresh for uncached dependencies', () => {
    const canProvideFresh = dependencyName => {
      expect(dependencyName).to.have.members(['dep1']);
      canProvideFresh.called = true;
      return true;
    };
    const canProvide = makeCanProvide(
      { dep1: ['missing_url'] },
      canProvideFresh
    );
    return canProvide(['dep1']).then(result => {
      expect(result).to.be.true;
      expect(canProvideFresh.called).to.be.true;
    });
  });

  after(() => {
    openCache().then(cache =>
      Promise.all(DEPENDENCY_URLS.map(url => cache.delete(url, new Response())))
    );
  });
});
