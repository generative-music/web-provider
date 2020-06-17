import transform from '@generative-music/sample-index-transformer';

const makeFetchAudioBuffer = audioContext => url =>
  window
    .fetch(url)
    .then(response => response.arrayBuffer())
    .then(ab => audioContext.decodeAudioData(ab));

const makeProvide = dependencyIndex => (dependencyNames = [], audioContext) =>
  transform(
    dependencyIndex,
    dependencyNames,
    makeFetchAudioBuffer(audioContext)
  );

export default makeProvide;
