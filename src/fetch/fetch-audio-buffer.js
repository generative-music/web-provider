const fetchAudioBuffer = (url, audioContext) =>
  window
    .fetch(url)
    .then(response => response.arrayBuffer())
    .then(ab => audioContext.decodeAudioData(ab));

export default fetchAudioBuffer;
