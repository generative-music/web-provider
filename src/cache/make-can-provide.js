import makeCanProvideFresh from '../fetch/make-can-provide';
import openCache from './open-cache';

const makeCanProvide = dependencyIndex => {
  const canProvideFresh = makeCanProvideFresh(dependencyIndex);

  const isNotCached = (cachedUrlSet, dependencyName) => {
    const dependency = dependencyIndex[dependencyName];
    const urls = Array.isArray(dependency)
      ? dependency
      : Reflect.ownKeys(dependency).map(key => dependency[key]);
    return urls.some(url => !cachedUrlSet.includes(url));
  };

  return (dependencyNames = []) => {
    if (dependencyNames.length === 0) {
      return Promise.resolve(true);
    }
    return openCache()
      .then(cache => cache.keys())
      .then(cachedUrls => {
        const cachedUrlSet = new Set(cachedUrls);
        const uncachedDependencyNames = dependencyNames.filter(dependencyName =>
          isNotCached(cachedUrlSet, dependencyName)
        );
        return canProvideFresh(uncachedDependencyNames);
      });
  };
};

export default makeCanProvide;
