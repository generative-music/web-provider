import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';
import promisifyTransaction from './promisify-transaction';

const getCachedUrl = (db, url) =>
  promisifyTransaction(
    db
      .transaction([DEPENDENCY_OBJECT_STORE_NAME])
      .objectStore(DEPENDENCY_OBJECT_STORE_NAME)
      .get(url)
  );

export default getCachedUrl;
