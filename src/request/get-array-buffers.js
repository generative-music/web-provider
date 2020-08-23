import isCacheApiSupported from '../cache/is-supported';
import isIndexedDbSupported from '../indexed-db/is-supported';
import cacheApiGet from '../cache/cached-get';
import indexedDbGet from '../indexed-db/cached-get';
import networkGet from '../fetch/get';
import getArrayBuffersWithFullSupport from './get-array-buffers-with-full-support';

export default (function chooseGetArrayBuffers() {
  if (isCacheApiSupported && isIndexedDbSupported) {
    return getArrayBuffersWithFullSupport;
  } else if (isCacheApiSupported) {
    return cacheApiGet;
  } else if (isIndexedDbSupported) {
    return indexedDbGet;
  }
  return networkGet;
})();
