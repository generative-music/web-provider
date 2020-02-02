import openCache from './open-cache';

const makeCanProvide = (dependencyIndex, canProvideFresh) => {
  const isNotCached = (cachedUrlSet, dependencyName) => {
    const dependency = dependencyIndex[dependencyName];
    const urls = Array.isArray(dependency)
      ? dependency
      : Reflect.ownKeys(dependency).map(key => dependency[key]);
    return urls.some(url => !cachedUrlSet.has(new Request(url).url));
  };

  return (dependencyNames = []) => {
    if (dependencyNames.length === 0) {
      return Promise.resolve(true);
    }
    return openCache()
      .then(cache => cache.keys())
      .then(cachedRequests => {
        const cachedUrlSet = new Set(cachedRequests.map(({ url }) => url));
        const uncachedDependencyNames = dependencyNames.filter(dependencyName =>
          isNotCached(cachedUrlSet, dependencyName)
        );
        return canProvideFresh(uncachedDependencyNames);
      });
  };
};

export default makeCanProvide;
