import getCachedUrl from './get-cached-url';
import openDb from './open-db';

const makeCanProvide = (dependencyIndex, canProvideFresh) => {
  const isNotCached = (db, dependencyName) => {
    const dependency = dependencyIndex[dependencyName];
    const urls = Array.isArray(dependency)
      ? dependency
      : Reflect.ownKeys(dependency).map(key => dependency[key]);
    return Promise.all(urls.map(url => getCachedUrl(db, url))).then(results =>
      results.some(arrayBuffer => !arrayBuffer)
    );
  };
  return (dependencyNames = []) => {
    if (dependencyNames.length === 0) {
      return Promise.resolve(true);
    }
    return openDb()
      .then(db =>
        Promise.all(
          dependencyNames.map(dependencyName => isNotCached(db, dependencyName))
        )
      )
      .then(isNotCachedResults => {
        const uncachedDependencyNames = dependencyNames.filter(
          (_, i) => isNotCachedResults[i]
        );
        return canProvideFresh(uncachedDependencyNames);
      });
  };
};

export default makeCanProvide;
