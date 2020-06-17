import transform from '@generative-music/sample-index-transformer';
import openCache from './open-cache';

const makeRetrieveAudioBuffer = (cache, audioContext) => url =>
  cache
    .match(url)
    .then(response => response || cache.add(url).then(() => cache.match(url)))
    .then(response => response.arrayBuffer())
    .then(ab => audioContext.decodeAudioData(ab));

const makeProvide = dependencyIndex => (dependencyNames = [], audioContext) =>
  openCache().then(cache =>
    transform(
      dependencyIndex,
      dependencyNames,
      makeRetrieveAudioBuffer(cache, audioContext)
    )
  );

export default makeProvide;
