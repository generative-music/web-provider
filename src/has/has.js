import isIndexedDbSupported from '../indexed-db/is-supported';
import getIndexedDbCacheKeys from '../indexed-db/get-keys';
import isCacheApiSupported from '../cache/is-supported';
import getCacheApiKeys from '../cache/get-keys';

const has = async (urls = []) => {
  if (window.navigator.onLine) {
    return true;
  }

  const [indexedDbKeySet, cacheApiKeySet] = await Promise.all([
    isIndexedDbSupported ? getIndexedDbCacheKeys() : [],
    isCacheApiSupported ? getCacheApiKeys() : [],
  ]).then(keyArrays => keyArrays.map(arr => new Set(arr)));

  return urls.every(
    url => indexedDbKeySet.has(url) || cacheApiKeySet.has(new Request(url).url)
  );
};

export default has;
