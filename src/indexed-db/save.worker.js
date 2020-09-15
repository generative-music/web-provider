import { promisifyRequest } from '@alexbainter/indexed-db';
import { Mp3Encoder } from 'lamejs';
import asyncPipe from '../shared/async-pipe';
import openDb from './open-db';
import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';
import isSupported from './is-supported';

const BLOCK_SIZE = 1152;
const KBPS = 128;

const encodeAsMp3 = ({ length, sampleRate, channelData }) => {
  const encoder = new Mp3Encoder(channelData.length, sampleRate, KBPS);
  const blocks = [];
  const int16ChannelData = Array.from({ length: channelData.length }, (_, i) =>
    channelData[i].map(float32Val =>
      float32Val < 0 ? float32Val * 0x8000 : float32Val * 0x7fff
    )
  );
  let mp3Buffer;
  for (let i = 0; i < length; i += BLOCK_SIZE) {
    const channelChunks = int16ChannelData.map(data =>
      data.subarray(i, i + BLOCK_SIZE)
    );
    mp3Buffer = encoder.encodeBuffer(...channelChunks);
    if (mp3Buffer.length > 0) {
      blocks.push(mp3Buffer);
    }
  }
  mp3Buffer = encoder.flush();
  if (mp3Buffer.length > 0) {
    blocks.push(mp3Buffer);
  }
  const blob = new Blob(blocks, { type: 'audio/mpeg' });
  return blob.arrayBuffer();
};

const cacheArrayBuffer = async (url, arrayBuffer) => {
  const db = await openDb();
  await promisifyRequest(
    db
      .transaction([DEPENDENCY_OBJECT_STORE_NAME], 'readwrite')
      .objectStore(DEPENDENCY_OBJECT_STORE_NAME)
      .put(arrayBuffer, url)
  );
};

self.onmessage = isSupported
  ? async event => {
      const {
        data: { url, audioBuffer },
      } = event;

      const encodeAndSave = asyncPipe(
        encodeAsMp3,
        cacheArrayBuffer.bind(null, url)
      );

      await encodeAndSave(audioBuffer);
      self.postMessage(url);
    }
  : () => {
      // not supported
    };
