import openCache from './open-cache';
import makeResolveDependencies from '../utils/make-resolve-dependencies';

const retrieveAudioBuffer = (cache, url, audioContext) =>
  cache
    .match(url)
    .then(response => response || cache.add(url).then(() => cache.match(url)))
    .then(response => response.arrayBuffer())
    .then(ab => audioContext.decodeAudioData(ab));

const retrieveAudioBuffers = (urls, audioContext) =>
  openCache().then(cache =>
    Promise.all(urls.map(url => retrieveAudioBuffer(cache, url, audioContext)))
  );

const makeProvide = dependencyIndex =>
  makeResolveDependencies(dependencyIndex, retrieveAudioBuffers);

export default makeProvide;
