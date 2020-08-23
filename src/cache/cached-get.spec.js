import sinon from 'sinon';
import cachedGet from './cached-get';

const CACHED_URLS = Array.from({ length: 4 }, (_, i) => `cached/url/${i}`);
const UNCACHED_URLS = Array.from({ length: 4 }, (_, i) => `uncached/url/${i}`);
const URLS = CACHED_URLS.concat(UNCACHED_URLS);

const added = new Set();

const markArrayBuffer = url => `${url}::ARRAY_BUFFER`;

const mockCache = {
  add: url => {
    added.add(url);
    return Promise.resolve();
  },
  match: url =>
    Promise.resolve(
      added.has(url)
        ? { arrayBuffer: () => Promise.resolve(markArrayBuffer(url)) }
        : null
    ),
};

const originalCaches = window.caches;

describe('cache/cached-get', () => {
  before(() => {
    Object.defineProperty(window, 'caches', {
      get: () => ({
        open: () => Promise.resolve(mockCache),
      }),
    });
  });
  after(() => {
    Object.defineProperty(window, 'caches', {
      get: () => originalCaches,
    });
  });
  beforeEach(() => {
    added.clear();
    CACHED_URLS.forEach(url => {
      added.add(url);
    });
  });
  it('return the results as arrayBuffers', async () => {
    const results = await cachedGet(URLS);
    expect(results).to.eql(URLS.map(markArrayBuffer));
  });
  it('should cache any uncached urls', async () => {
    await cachedGet(UNCACHED_URLS);
    expect(Array.from(added)).to.include.members(UNCACHED_URLS);
  });
  it("shouldn't add cached urls again", async () => {
    sinon.spy(added, 'add');
    await cachedGet(CACHED_URLS);
    expect(added.add.called).to.be.false;
    added.add.restore();
  });
});
