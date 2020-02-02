import openCache from './open-cache';
import makeResolveDependencies from '../utils/make-resolve-dependencies';

const makeRetrieveAudioBuffer = (cache, audioContext) => url =>
  cache
    .match(url)
    .then(response => response || cache.add(url).then(() => cache.match(url)))
    .then(response => response.arrayBuffer())
    .then(ab => audioContext.decodeAudioData(ab));

const makeProvide = dependencyIndex => {
  const resolveDependencies = makeResolveDependencies(dependencyIndex);
  return (dependencyNames = [], audioContext) =>
    openCache().then(cache =>
      resolveDependencies(
        dependencyNames,
        makeRetrieveAudioBuffer(cache, audioContext)
      )
    );
};

export default makeProvide;
