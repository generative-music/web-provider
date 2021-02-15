import { promisifyRequest } from '@alexbainter/indexed-db';
import openDb from './open-db';
import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';

const getKeys = () =>
  openDb()
    .then(db =>
      promisifyRequest(
        db
          .transaction([DEPENDENCY_OBJECT_STORE_NAME])
          .objectStore(DEPENDENCY_OBJECT_STORE_NAME)
          .getAllKeys()
      )
    )
    .catch(error => {
      console.error('Unable to get provider keys', error);
      return [];
    });

export default getKeys;
