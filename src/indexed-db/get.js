import openDb from './open-db';
import promisifyTransaction from './promisify-transaction';
import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';

const get = async (urls = []) => {
  const db = await openDb();
  const objectStore = db
    .transaction([DEPENDENCY_OBJECT_STORE_NAME])
    .objectStore(DEPENDENCY_OBJECT_STORE_NAME);
  return Promise.all(
    urls.map(url =>
      promisifyTransaction(objectStore.get(url)).catch(() => null)
    )
  );
};

export default get;
