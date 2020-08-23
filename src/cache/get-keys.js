import openCache from './open-cache';

const getKeys = async () => {
  const cache = await openCache();
  const keys = await cache.keys();
  return keys.map(({ url }) => url);
};

export default getKeys;
