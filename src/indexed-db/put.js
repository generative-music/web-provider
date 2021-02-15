import { promisifyRequest } from '@alexbainter/indexed-db';
import openDb from './open-db';
import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';

const put = (keyValuePairs = []) =>
  openDb()
    .then(db => {
      const objectStore = db
        .transaction([DEPENDENCY_OBJECT_STORE_NAME], 'readwrite')
        .objectStore(DEPENDENCY_OBJECT_STORE_NAME);
      return Promise.all(
        keyValuePairs.map(([key, value]) =>
          promisifyRequest(objectStore.put(value, key))
        )
      );
    })
    .catch(err => {
      console.error('Unable to put samples', err);
    });

export default put;
