import openDb from './open-db';
import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';
import promisifyTransaction from './promisify-transaction';
import makeProvide from './make-provide';

const DEPENDENCY_URLS = ['dep1/url1', 'dep1/url2', 'dep2/url1', 'dep2/url2'];

const markDecoded = str => `${str}::DECODED`;
const markProvidedFresh = url => `${url}::FRESH`;

const mockAudioContext = {
  decodeAudioData: input => Promise.resolve(markDecoded(input)),
};

describe('makeProvide', () => {
  before(() =>
    openDb().then(db =>
      Promise.all(
        DEPENDENCY_URLS.map(url =>
          promisifyTransaction(
            db
              .transaction([DEPENDENCY_OBJECT_STORE_NAME], 'readwrite')
              .objectStore(DEPENDENCY_OBJECT_STORE_NAME)
              .put(url, url)
          )
        )
      )
    )
  );

  it('should retrieve cached depedencies without defering to getFresh', () => {
    const dependencyIndex = {
      dep1: { url1: 'dep1/url1', url2: 'dep2/url2' },
      dep2: ['dep2/url1', 'dep2/url2'],
    };
    const getFresh = () => {
      throw new Error('getFresh called');
    };
    return makeProvide(dependencyIndex, getFresh)(
      ['dep1', 'dep2'],
      mockAudioContext
    ).then(dependencies => {
      expect(dependencies).to.have.property('dep1');
      expect(dependencies).to.have.property('dep2');
      Reflect.ownKeys(dependencies).forEach(dependencyName => {
        if (dependencyName === 'dep1') {
          Reflect.ownKeys(dependencies[dependencyName]).forEach(key => {
            expect(dependencies[dependencyName][key]).to.equal(
              markDecoded(dependencyIndex[dependencyName][key])
            );
          });
        } else {
          dependencies[dependencyName].forEach((result, i) => {
            expect(result).to.equal(
              markDecoded(dependencyIndex[dependencyName][i])
            );
          });
        }
      });
    });
  });

  it('should call provideFresh with uncached dependency names, cache the results, and return decoded results', () => {
    const dependencyIndex = {
      dep1: { url1: 'NOPE1', url2: 'NOPE2' },
      dep2: ['NOPE3', 'NOPE4'],
    };
    const getFresh = url => Promise.resolve(markProvidedFresh(url));
    return makeProvide(dependencyIndex, getFresh)(
      ['dep1', 'dep2'],
      mockAudioContext
    ).then(dependencies => {
      expect(dependencies).to.have.property('dep1');
      expect(dependencies).to.have.property('dep2');
      Reflect.ownKeys(dependencies).forEach(dependencyName => {
        if (dependencyName === 'dep1') {
          Reflect.ownKeys(dependencies[dependencyName]).forEach(key => {
            expect(dependencies[dependencyName][key]).to.equal(
              markDecoded(
                markProvidedFresh(dependencyIndex[dependencyName][key])
              )
            );
          });
        }
      });
    });
  });

  after(() =>
    openDb().then(db =>
      Promise.all(
        DEPENDENCY_URLS.concat(
          Array.from({ length: 4 }, (_, i) => `NOPE${i + 1}`)
        ).map(url =>
          promisifyTransaction(
            db
              .transaction([DEPENDENCY_OBJECT_STORE_NAME], 'readwrite')
              .objectStore(DEPENDENCY_OBJECT_STORE_NAME)
              .delete(url)
          )
        )
      )
    )
  );
});
