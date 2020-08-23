import getArrayBuffers from './get-array-buffers';

const request = async (audioContext, urls = []) => {
  const arrayBuffers = await getArrayBuffers(urls);
  return Promise.all(
    arrayBuffers.map(
      arrayBuffer => arrayBuffer && audioContext.decodeAudioData(arrayBuffer)
    )
  );
};

export default request;
