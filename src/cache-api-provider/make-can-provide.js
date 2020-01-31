import openCache from './open-cache';

const makeCanProvide = ({ depenedencyIndex }) => (dependencyNames = []) =>
  openCache()
    .then(cache => cache.keys())
    .then(keys => {
      const urlSet = new Set(keys.map(({ url }) => url));
      return dependencyNames.
    });
