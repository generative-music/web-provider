import openCache from './open-cache';
import getFromNetwork from '../fetch/get';

const cachedGet = async (urls = []) => {
  try {
    const cache = await openCache();
    return Promise.all(
      urls.map(url =>
        cache
          .match(url)
          .then(
            response => response || cache.add(url).then(() => cache.match(url))
          )
          .then(response => response.arrayBuffer())
          .catch(() => null)
      )
    );
  } catch (err) {
    console.error('Unable to get samples from cache', err);
    return getFromNetwork(urls);
  }
};

export default cachedGet;
