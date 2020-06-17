import transform from '@generative-music/sample-index-transformer';
import openDb from './open-db';
import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';
import promisifyTransaction from './promisify-transaction';
import getCachedUrl from './get-cached-url';

const cacheUrl = (db, url, arrayBuffer) =>
  promisifyTransaction(
    db
      .transaction([DEPENDENCY_OBJECT_STORE_NAME], 'readwrite')
      .objectStore(DEPENDENCY_OBJECT_STORE_NAME)
      .put(arrayBuffer, url)
  );

const makeGetFreshAndCache = (db, getFreshUrl) => url =>
  getFreshUrl(url).then(arrayBuffer =>
    cacheUrl(db, url, arrayBuffer).then(() => arrayBuffer)
  );

const makeGetFromCache = db => url => getCachedUrl(db, url);

const makeGetUrl = (db, getFreshUrl) => {
  const getFromCache = makeGetFromCache(db);
  const getFreshAndCache = makeGetFreshAndCache(db, getFreshUrl);
  return url =>
    getFromCache(url).then(arrayBuffer => arrayBuffer || getFreshAndCache(url));
};

const makeProvideWithFallback = (dependencyIndex, getFresh) => (
  dependencyNames = [],
  audioContext
) =>
  openDb().then(db => {
    const getUrl = makeGetUrl(db, getFresh);
    return transform(dependencyIndex, dependencyNames, url =>
      getUrl(url).then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    );
  });

export default makeProvideWithFallback;
