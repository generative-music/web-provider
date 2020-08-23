const inProgress = new Set();

const WORKER_MESSAGE_EVENT_TYPE = 'message';

const save = async (worker, cacheEntries) => {
  if (!worker) {
    return;
  }

  const validCacheEntries = cacheEntries.filter(
    ([url, audioBuffer]) => url && !inProgress.has(url) && audioBuffer
  );

  if (validCacheEntries.length === 0) {
    return;
  }

  await Promise.all(
    validCacheEntries.map(
      ([url, audioBuffer]) =>
        new Promise(resolve => {
          inProgress.add(url);

          const serializableAudioBuffer = {
            length: audioBuffer.length,
            sampleRate: audioBuffer.sampleRate,
            channelData: Array.from(
              { length: audioBuffer.numberOfChannels },
              (_, i) => audioBuffer.getChannelData(i)
            ),
          };

          const handleMessage = ({ data }) => {
            if (data.url === url) {
              worker.removeEventListener(
                WORKER_MESSAGE_EVENT_TYPE,
                handleMessage
              );
              inProgress.remove(url);
              resolve();
            }
          };

          worker.addEventListener(WORKER_MESSAGE_EVENT_TYPE, handleMessage);
          worker.postMessage({ url, audioBuffer: serializableAudioBuffer });
        })
    )
  );
};

export default save;
