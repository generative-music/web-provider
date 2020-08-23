import getKeys from './get-keys';
import getFromDb from './get';
import put from './put';
import getFromNetwork from '../fetch/get';
import pair from '../shared/pair';

const cachedGet = async (urls = []) => {
  const keys = await getKeys();
  const keySet = new Set(keys);
  const cachedUrls = [];
  const uncachedUrls = [];
  urls.forEach(url => {
    const target = keySet.has(url) ? cachedUrls : uncachedUrls;
    Array.prototype.push.call(target, url);
  });
  const pairs = await Promise.all([
    getFromDb(cachedUrls).then(arrayBuffers => pair(cachedUrls, arrayBuffers)),
    getFromNetwork(uncachedUrls).then(async arrayBuffers => {
      const uncachedPairs = pair(uncachedUrls, arrayBuffers);
      await put(
        uncachedPairs.filter(([, arrayBuffer]) => arrayBuffer !== null)
      );
      return uncachedPairs;
    }),
  ]);
  const urlIndexMap = urls.reduce((map, url, i) => {
    map.set(url, i);
    return map;
  }, new Map());
  return pairs.flat().reduce((arrayBuffers, [url, arrayBuffer]) => {
    const index = urlIndexMap.get(url);
    arrayBuffers[index] = arrayBuffer;
    return arrayBuffers;
  }, []);
};

export default cachedGet;
