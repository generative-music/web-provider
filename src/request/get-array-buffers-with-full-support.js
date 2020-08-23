import getIndexedDbKeys from '../indexed-db/get-keys';
import cacheApiGet from '../cache/cached-get';
import indexedDbGet from '../indexed-db/cached-get';
import pair from '../shared/pair';

const getArrayBuffersWithFullSupport = async (urls = []) => {
  const indexedDbKeySet = new Set(await getIndexedDbKeys());
  const urlsInIndexedDb = [];
  const urlsNotInIndexedDb = [];
  urls.forEach(url => {
    if (indexedDbKeySet.has(url)) {
      urlsInIndexedDb.push(url);
    } else {
      urlsNotInIndexedDb.push(url);
    }
  });

  const urlArrayBufferPairs = await Promise.all([
    indexedDbGet(urlsInIndexedDb).then(arrayBuffers =>
      pair(urlsInIndexedDb, arrayBuffers)
    ),
    cacheApiGet(urlsNotInIndexedDb).then(arrayBuffers =>
      pair(urlsNotInIndexedDb, arrayBuffers)
    ),
  ]);

  const urlIndexMap = urls.reduce((map, url, i) => {
    map.set(url, i);
    return map;
  }, new Map());

  return urlArrayBufferPairs.flat().reduce((arr, [url, audioBuffer]) => {
    const index = urlIndexMap.get(url);
    arr[index] = audioBuffer;
    return arr;
  }, []);
};

export default getArrayBuffersWithFullSupport;
