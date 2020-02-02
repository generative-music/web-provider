import makeResolveDependencies from '../utils/make-resolve-dependencies';

const makeFetchAudioBuffer = audioContext => url =>
  window
    .fetch(url)
    .then(response => response.arrayBuffer())
    .then(ab => audioContext.decodeAudioData(ab));

const makeProvide = dependencyIndex => {
  const resolveDependencies = makeResolveDependencies(dependencyIndex);
  return (dependencyNames = [], audioContext) =>
    resolveDependencies(dependencyNames, makeFetchAudioBuffer(audioContext));
};

export default makeProvide;
