import makeResolveDependencies from '../utils/make-resolve-dependencies';

const fetchAudioBuffer = (url, audioContext) =>
  window
    .fetch(url)
    .then(response => response.arrayBuffer())
    .then(ab => audioContext.decodeAudioData(ab));

const fetchAudioBuffers = (urls, audioContext) =>
  Promise.all(urls.map(url => fetchAudioBuffer(url, audioContext)));

const makeProvide = dependencyIndex =>
  makeResolveDependencies(dependencyIndex, fetchAudioBuffers);

export default makeProvide;
