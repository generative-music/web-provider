import asyncPipe from '../shared/async-pipe';

const getResponseAsArrayBuffer = response => response.arrayBuffer();

const makeFetchAudioBuffers = audioContext => urls =>
  Promise.all(
    urls.map(
      asyncPipe(
        window.fetch,
        getResponseAsArrayBuffer,
        audioContext.decodeAudioData
      )
    )
  );

const request = (sampleIndex = {}, audioContext, instrumentNames = []) => {
  const fetchAudioBuffers = makeFetchAudioBuffers(audioContext);
  return Promise.all(
    instrumentNames.map(async instrumentName => {
      const samples = sampleIndex[instrumentName];
      if (Array.isArray(samples)) {
        return fetchAudioBuffers(samples);
      }
      if (samples !== null && typeof samples === 'object') {
        const audioBuffers = await fetchAudioBuffers(Object.values(samples));
        const notes = Object.keys(samples);
        return audioBuffers.reduce((o, audioBuffer, i) => {
          const note = notes[i];
          o[note] = audioBuffer;
          return o;
        }, {});
      }
      return null;
    })
  );
};

export default request;
