import { promisifyRequest } from '@alexbainter/indexed-db';
import openDb from './open-db';
import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';

const getKeys = async () => {
  const db = await openDb();
  return promisifyRequest(
    db
      .transaction([DEPENDENCY_OBJECT_STORE_NAME])
      .objectStore(DEPENDENCY_OBJECT_STORE_NAME)
      .getAllKeys()
  );
};

export default getKeys;
