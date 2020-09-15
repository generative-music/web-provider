import { promisifyRequest } from '@alexbainter/indexed-db';
import openDb from './open-db';
import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';

const put = async (keyValuePairs = []) => {
  const db = await openDb();
  const objectStore = db
    .transaction([DEPENDENCY_OBJECT_STORE_NAME], 'readwrite')
    .objectStore(DEPENDENCY_OBJECT_STORE_NAME);
  return Promise.all(
    keyValuePairs.map(([key, value]) =>
      promisifyRequest(objectStore.put(value, key))
    )
  );
};

export default put;
