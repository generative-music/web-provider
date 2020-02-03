import { makeCacheProvider } from './cache/make-cache-provider';
import { makeFetchProvider } from './fetch/make-fetch-provider';
import { makeIndexedDbProvider } from './indexed-db/make-indexed-db-provider';

const makeWebProvider = dependencyIndex => {
  if (window.caches) {
    return makeCacheProvider(dependencyIndex);
  }
  if (window.indexedDB) {
    return makeIndexedDbProvider(dependencyIndex);
  }
  return makeFetchProvider(dependencyIndex);
};

export default makeWebProvider;
