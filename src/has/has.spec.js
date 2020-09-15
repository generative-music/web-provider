import { promisifyRequest } from '@alexbainter/indexed-db';
import has from './has';
import openDb from '../indexed-db/open-db';
import DEPENDENCY_OBJECT_STORE_NAME from '../indexed-db/dependency-object-store-name';

const URLS = Array.from({ length: 4 }, (_, i) => `/url/${i}`);

const INDEXED_DB_URLS = Array.from({ length: 4 }, (_, i) => `/idb/url/${i}`);
const CACHE_API_URLS = Array.from({ length: 4 }, (_, i) => `/cache/url/${i}`);

const mockCache = {
  keys: () => Promise.resolve(CACHE_API_URLS.map(url => new Request(url))),
};

const originalCaches = window.caches;

describe('has', () => {
  describe('when navigator.onLine is true', () => {
    it('should return true', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        get: () => true,
        configurable: true,
      });
      const result = await has(URLS);
      expect(result).to.be.true;
    });
  });

  describe('when navigator.onLine is false', () => {
    before(async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        get: () => false,
        configurable: true,
      });
      Object.defineProperty(window, 'caches', {
        get: () => ({ open: () => Promise.resolve(mockCache) }),
        configurable: true,
      });
      const db = await openDb();
      const objectStore = db
        .transaction([DEPENDENCY_OBJECT_STORE_NAME], 'readwrite')
        .objectStore(DEPENDENCY_OBJECT_STORE_NAME);
      await Promise.all(
        INDEXED_DB_URLS.map(url => promisifyRequest(objectStore.put(url, url)))
      );
    });
    after(async () => {
      Object.defineProperty(window.navigator, 'caches', {
        get: () => originalCaches,
        configurable: true,
      });
      const db = await openDb();
      const objectStore = db
        .transaction([DEPENDENCY_OBJECT_STORE_NAME], 'readwrite')
        .objectStore(DEPENDENCY_OBJECT_STORE_NAME);
      await Promise.all(
        INDEXED_DB_URLS.map(url => promisifyRequest(objectStore.delete(url)))
      );
    });
    it('should return false if the URLS are not cached', async () => {
      const result = await has(URLS);
      expect(result).to.be.false;
    });
    it('should return true if every URL is an IndexedDb key or a Cache API key', async () => {
      const result = await has(INDEXED_DB_URLS.concat(CACHE_API_URLS));
      expect(result).to.be.true;
    });
  });
});
