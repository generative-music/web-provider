import { promisifyRequest } from '@alexbainter/indexed-db';
import openDb from './open-db';
import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';

const get = (urls = []) =>
  openDb()
    .then(db => {
      const objectStore = db
        .transaction([DEPENDENCY_OBJECT_STORE_NAME])
        .objectStore(DEPENDENCY_OBJECT_STORE_NAME);
      return Promise.all(
        urls.map(url =>
          promisifyRequest(objectStore.get(url)).catch(() => null)
        )
      );
    })
    .catch(err => {
      console.error('Unable to get urls', err);
    });

export default get;
