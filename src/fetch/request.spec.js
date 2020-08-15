import request from './request';
import pipe from '../shared/pipe';
import asyncPipe from '../shared/async-pipe';

const markFetched = url => `${url}::FETCHED`;
const markArrayBuffer = fetchedUrl => `${fetchedUrl}::ARRAY_BUFFER`;
const markDecoded = arrayBuffer => `${arrayBuffer}::DECODED`;

const markFetchedAsArrayBufferAndDecoded = pipe(
  markFetched,
  markArrayBuffer,
  markDecoded
);

const mockFetch = url => {
  const fetchedUrl = markFetched(url);
  return Promise.resolve({
    arrayBuffer: () => Promise.resolve(markArrayBuffer(fetchedUrl)),
  });
};

const mockAudioContext = {
  decodeAudioData: asyncPipe(markDecoded),
};

describe('fetch.request', () => {
  before(() => {
    Object.defineProperty(window, 'fetch', { get: () => mockFetch });
  });
  it('should fetch urls as arrayBuffers which are then decoded to audioBuffers', () => {
    const dependencyIndex = {
      dep1: { url1: 'dep1/url1', url2: 'dep1/url2' },
      dep2: ['dep2/url1', 'dep2/url2'],
    };
    return request(dependencyIndex, mockAudioContext, ['dep1', 'dep2']).then(
      ([dep1, dep2]) => {
        const dep1Keys = Object.keys(dep1);
        expect(dep1Keys).to.have.length(
          Object.keys(dependencyIndex.dep1).length
        );
        dep1Keys.forEach(key => {
          expect(dep1[key]).to.equal(
            markFetchedAsArrayBufferAndDecoded(dependencyIndex.dep1[key])
          );
        });
        expect(dep2).to.eql(
          dependencyIndex.dep2.map(markFetchedAsArrayBufferAndDecoded)
        );
      }
    );
  });
});
