import openCache from './open-cache';

const cachedGet = async (urls = []) => {
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
};

export default cachedGet;
