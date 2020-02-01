import openDb from './open-db';
import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';
import promisifyTransaction from './promisify-transaction';
import getCachedUrl from './get-cached-url';
import makeResolveDependencies from '../utils/make-resolve-dependencies';

const cacheUrl = (db, url, arrayBuffer) =>
  promisifyTransaction(
    db
      .transaction([DEPENDENCY_OBJECT_STORE_NAME])
      .objectStore(DEPENDENCY_OBJECT_STORE_NAME)
      .put(arrayBuffer, url)
  );

const retrieveAudioBuffer = (db, url, audioContext) =>
  getCachedUrl(db, url).then(
    arrayBuffer => arrayBuffer && audioContext.decodeAudioData(arrayBuffer)
  );

const retrieveAudioBuffers = (urls, audioContext) =>
  openDb().then(db =>
    Promise.all(urls.map(url => retrieveAudioBuffer(db, url, audioContext)))
  );

const makeProvideAndCacheDependencies = (provide, dependencyIndex) => (
  dependencyNames,
  audioContext
) =>
  Promise.all(provide(dependencyNames, audioContext), openDb()).then(
    ([fallbackDependencies, db]) =>
      Promise.all(
        Reflect.ownKeys(fallbackDependencies).reduce(
          (cachePromises, dependencyName) => {
            const requestedDependency = dependencyIndex[dependencyName];
            const fallbackDependency = fallbackDependencies[dependencyName];
            if (Array.isArray(fallbackDependency)) {
              return cachePromises.concat(
                fallbackDependency.map((arrayBuffer, i) =>
                  cacheUrl(db, requestedDependency[i], arrayBuffer)
                )
              );
            }
            return cachePromises.concat(
              Reflect.ownKeys(fallbackDependency).map(key =>
                cacheUrl(db, requestedDependency[key], fallbackDependency[key])
              )
            );
          },
          []
        )
      ).then(() => fallbackDependencies)
  );

const makeProvideWithFallback = (dependencyIndex, provideFresh) => {
  const provideFromCache = makeResolveDependencies(
    dependencyIndex,
    retrieveAudioBuffers
  );
  const provideAndCacheDependencies = makeProvideAndCacheDependencies(
    provideFresh,
    dependencyIndex
  );
  return (dependencyNames, audioContext) =>
    provideFromCache(dependencyNames, audioContext).then(cachedDependencies => {
      const uncachedDependencyNames = Reflect.ownKeys(
        cachedDependencies
      ).filter(dependencyName => {
        const cachedDependency = cachedDependencies[dependencyName];
        if (Array.isArray(cachedDependency)) {
          return cachedDependency.every(arrayBuffer => arrayBuffer !== null);
        }
        return Reflect.ownKeys(cachedDependency).every(
          key => cachedDependency[key] !== null
        );
      });
      if (uncachedDependencyNames.length === 0) {
        return cachedDependencies;
      }
      return provideAndCacheDependencies(
        uncachedDependencyNames,
        audioContext
      ).then(fallbackDependencies =>
        Object.assign({}, cachedDependencies, fallbackDependencies)
      );
    });
};

export default makeProvideWithFallback;
