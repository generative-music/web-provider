import { promisifyRequest } from '@alexbainter/indexed-db';
import openDb from './open-db';
import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';
import cachedGet from './cached-get';

const CACHED_URLS = Array.from({ length: 4 }, (_, i) => `/cached/url/${i}`);
const UNCACHED_URLS = Array.from({ length: 4 }, (_, i) => `/url/${i}`);

const markFetched = url => `${url}::FETCHED`;
const markLoadedFromCache = url => `${url}::CACHED`;

const mockFetch = url =>
  Promise.resolve({
    arrayBuffer: () => Promise.resolve(markFetched(url)),
  });

describe('indexed-db/cached-get', () => {
  before(() => {
    window.fetch = mockFetch;
  });
  beforeEach(async () => {
    const db = await openDb();
    const objectStore = db
      .transaction([DEPENDENCY_OBJECT_STORE_NAME], 'readwrite')
      .objectStore(DEPENDENCY_OBJECT_STORE_NAME);
    await Promise.all(
      CACHED_URLS.map(url =>
        promisifyRequest(objectStore.put(markLoadedFromCache(url), url))
      ).concat(
        UNCACHED_URLS.map(url => promisifyRequest(objectStore.delete(url)))
      )
    );
  });
  after(async () => {
    const db = await openDb();
    const objectStore = db
      .transaction([DEPENDENCY_OBJECT_STORE_NAME], 'readwrite')
      .objectStore(DEPENDENCY_OBJECT_STORE_NAME);
    await Promise.all(
      CACHED_URLS.concat(UNCACHED_URLS).map(url =>
        promisifyRequest(objectStore.delete(url))
      )
    );
  });
  it('should either fetch or load urls from the cache if available', async () => {
    const results = await cachedGet(CACHED_URLS.concat(UNCACHED_URLS));
    const cacheResults = results.slice(0, CACHED_URLS.length);
    const uncachedResults = results.slice(CACHED_URLS.length);
    expect(cacheResults).to.eql(CACHED_URLS.map(markLoadedFromCache));
    expect(uncachedResults).to.eql(UNCACHED_URLS.map(markFetched));
  });
  it('should cache the results of fetched urls', async () => {
    await cachedGet(UNCACHED_URLS);
    const db = await openDb();
    const objectStore = db
      .transaction([DEPENDENCY_OBJECT_STORE_NAME])
      .objectStore(DEPENDENCY_OBJECT_STORE_NAME);
    const cachedContents = await Promise.all(
      UNCACHED_URLS.map(url => promisifyRequest(objectStore.get(url)))
    );
    expect(cachedContents).to.eql(UNCACHED_URLS.map(markFetched));
  });
});
