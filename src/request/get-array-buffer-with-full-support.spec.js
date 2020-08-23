import openDb from '../indexed-db/open-db';
import promisifyTransaction from '../indexed-db/promisify-transaction';
import DEPENDENCY_OBJECT_STORE_NAME from '../indexed-db/dependency-object-store-name';
import getArrayBuffersWithFullSupport from './get-array-buffers-with-full-support';

const CACHED_URLS = Array.from({ length: 4 }, (_, i) => `/cached/url/${i}`);
const UNCACHED_URLS = Array.from({ length: 4 }, (_, i) => `/uncached/url/${i}`);

const markLoadedFromIndexedDb = url => `${url}::IDB`;
const markLoadedFromCacheAPI = url => `${url}::CACHE_API`;

const added = new Set();

const mockCache = {
  match: url =>
    Promise.resolve(
      added.has(url)
        ? { arrayBuffer: () => Promise.resolve(markLoadedFromCacheAPI(url)) }
        : null
    ),
  add: url => {
    added.add(url);
    return Promise.resolve();
  },
};

const originalCaches = window.caches;

describe('get-array-buffers-with-full-support', () => {
  before(() => {
    Object.defineProperty(window, 'caches', {
      get: () => ({
        open: () => Promise.resolve(mockCache),
      }),
      configurable: true,
    });
  });
  beforeEach(async () => {
    added.clear();
    const db = await openDb();
    const objectStore = db
      .transaction([DEPENDENCY_OBJECT_STORE_NAME], 'readwrite')
      .objectStore(DEPENDENCY_OBJECT_STORE_NAME);
    await Promise.all(
      CACHED_URLS.map(url =>
        promisifyTransaction(objectStore.put(markLoadedFromIndexedDb(url), url))
      ).concat(
        UNCACHED_URLS.map(url => promisifyTransaction(objectStore.delete(url)))
      )
    );
  });
  after(async () => {
    Object.defineProperty(window, 'caches', {
      get: () => originalCaches,
    });
    const db = await openDb();
    const objectStore = db
      .transaction([DEPENDENCY_OBJECT_STORE_NAME], 'readwrite')
      .objectStore(DEPENDENCY_OBJECT_STORE_NAME);
    await Promise.all(
      CACHED_URLS.concat(UNCACHED_URLS).map(url =>
        promisifyTransaction(objectStore.delete(url))
      )
    );
  });
  it('should either load from IndexedDB or add with the Cache API', async () => {
    const results = await getArrayBuffersWithFullSupport(
      CACHED_URLS.concat(UNCACHED_URLS)
    );
    const cachedResults = results.slice(0, CACHED_URLS.length);
    const uncachedResults = results.slice(CACHED_URLS.length);
    expect(cachedResults).to.eql(CACHED_URLS.map(markLoadedFromIndexedDb));
    expect(uncachedResults).to.eql(UNCACHED_URLS.map(markLoadedFromCacheAPI));
  });
});
