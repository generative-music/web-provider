/*eslint-env mocha*/
/*eslint-disable no-unused-expressions*/

import expect from 'chai/interface/expect';
import makeProvide from './make-provide';

const markArrayBuffer = url => `${url}::ARRAY_BUFFER`;
const markDecoded = arrayBuffer => `${arrayBuffer}::DECODED`;

const makeMockCache = () => {
  let added = [];
  const cached = new Set();
  return {
    add: url => {
      cached.add(url);
      added.push(url);
      return Promise.resolve();
    },
    match: url => {
      if (cached.has(url)) {
        return Promise.resolve({
          arrayBuffer: () => Promise.resolve(markArrayBuffer(url)),
        });
      }
      //eslint-disable-next-line no-undefined
      return Promise.resolve(undefined);
    },
    __reset: () => {
      cached.clear();
      added = [];
    },
    __silentlyAdd: (...urls) => {
      urls.forEach(url => cached.add(url));
    },
    __getAdded: () => added,
  };
};

const mockCache = makeMockCache();

const mockCaches = {
  open: () => Promise.resolve(mockCache),
};

const mockAudioContext = {
  decodeAudioData: arrayBuffer => Promise.resolve(markDecoded(arrayBuffer)),
};

const dependencyIndex = {
  dep1: { url1: 'dep1/url1', url2: 'dep1/url2' },
  dep2: ['dep2/url1', 'dep2/url2'],
};

describe('makeProvide', () => {
  before(() => {
    Object.defineProperty(window, 'caches', { get: () => mockCaches });
  });
  beforeEach(() => {
    mockCache.__reset();
  });
  it('should retrieve cached dependencies directly from the cache', () => {
    mockCache.__silentlyAdd('dep1/url1', 'dep1/url2', 'dep2/url1', 'dep2/url2');
    return makeProvide(dependencyIndex)(
      ['dep1', 'dep2'],
      mockAudioContext
    ).then(() => {
      const added = mockCache.__getAdded();
      expect(added).to.be.empty;
    });
  });
  it('should add uncached dependencies', () =>
    makeProvide(dependencyIndex)(['dep1', 'dep2'], mockAudioContext).then(
      () => {
        const added = mockCache.__getAdded();
        expect(added).to.have.members([
          'dep1/url1',
          'dep1/url2',
          'dep2/url1',
          'dep2/url2',
        ]);
      }
    ));
  it('should return a structure matching dependencyIndex with the urls fetched as arrayBuffers and decoded to audioBuffers', () => {
    mockCache.__silentlyAdd('dep1/url1', 'dep1/url2');
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
            inputDependency.map(url => markDecoded(markArrayBuffer(url)))
          );
        } else {
          Reflect.ownKeys(outputDependency).forEach(key => {
            expect(outputDependency[key]).to.equal(
              markDecoded(markArrayBuffer(inputDependency[key]))
            );
          });
        }
      });
    });
  });
});
