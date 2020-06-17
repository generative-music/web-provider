import openDb from './open-db';
import getCachedUrl from './get-cached-url';
import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';
import promisifyTransaction from './promisify-transaction';

const TEST_URL = 'url';
const TEST_VALUE = 'value';

describe('getCachedUrl', () => {
  let db;
  before(() =>
    openDb().then(result => {
      db = result;
      return promisifyTransaction(
        db
          .transaction([DEPENDENCY_OBJECT_STORE_NAME], 'readwrite')
          .objectStore(DEPENDENCY_OBJECT_STORE_NAME)
          .put(TEST_VALUE, TEST_URL)
      );
    })
  );

  it('should return the cached value for the url', () =>
    getCachedUrl(db, TEST_URL).then(value =>
      expect(value).to.equal(TEST_VALUE)
    ));

  it('should return undefined if no value exists for the url', () =>
    getCachedUrl(db, `${TEST_URL}::bad`).then(
      value => expect(value).to.be.undefined
    ));

  after(() =>
    promisifyTransaction(
      db
        .transaction([DEPENDENCY_OBJECT_STORE_NAME], 'readwrite')
        .objectStore(DEPENDENCY_OBJECT_STORE_NAME)
        .delete(TEST_URL)
    )
  );
});
