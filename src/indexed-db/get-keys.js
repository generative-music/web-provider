import openDb from './open-db';
import promisifyTransaction from './promisify-transaction';
import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';

const getKeys = async () => {
  const db = await openDb();
  return promisifyTransaction(
    db
      .transaction([DEPENDENCY_OBJECT_STORE_NAME])
      .objectStore(DEPENDENCY_OBJECT_STORE_NAME)
      .getAllKeys()
  );
};

export default getKeys;
