/*eslint-env mocha*/

import expect from 'chai/interface/expect';
import makeProvide from './make-provide';

const markFetched = url => `${url}::FETCHED`;
const markArrayBuffer = fetchedUrl => `${fetchedUrl}::ARRAY_BUFFER`;
const markDecoded = arrayBuffer => `${arrayBuffer}::DECODED`;

const markFetchedAsArrayBufferAndDecoded = url =>
  [markFetched, markArrayBuffer, markDecoded].reduce(
    (lastValue, fn) => fn(lastValue),
    url
  );

const mockFetch = url => {
  const fetchedUrl = markFetched(url);
  return Promise.resolve({
    arrayBuffer: () => Promise.resolve(markArrayBuffer(fetchedUrl)),
  });
};

const mockAudioContext = {
  decodeAudioData: arrayBuffer => Promise.resolve(markDecoded(arrayBuffer)),
};

describe('makeProvide', () => {
  before(() => {
    Object.defineProperty(window, 'fetch', { get: () => mockFetch });
  });
  it('should fetch urls as arrayBuffers which are then decoded to audioBuffers', () => {
    const dependencyIndex = {
      dep1: { url1: 'dep1/url1', url2: 'dep1/url2' },
      dep2: ['dep2/url1', 'dep2/url2'],
    };
    return makeProvide(dependencyIndex)(
      ['dep1', 'dep2'],
      mockAudioContext
    ).then(output => {
      expect(output).to.have.property('dep1');
      expect(output).to.have.property('dep2');
      Reflect.ownKeys(output).forEach(dependencyName => {
        const inputDependency = dependencyIndex[dependencyName];
        const outputDependency = output[dependencyName];
        if (dependencyName === 'dep2') {
          expect(outputDependency).to.have.members(
            inputDependency.map(url => markFetchedAsArrayBufferAndDecoded(url))
          );
        } else {
          Reflect.ownKeys(outputDependency).forEach(key => {
            expect(outputDependency[key]).to.equal(
              markFetchedAsArrayBufferAndDecoded(inputDependency[key])
            );
          });
        }
      });
    });
  });
});
