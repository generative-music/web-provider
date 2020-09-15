import { makeOpenDb } from '@alexbainter/indexed-db';
import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';

const DB_VERSION = 1;
const DB_NAME = '@generative-music/web-provider::cache';

const onUpgradeNeeded = event => {
  const db = event.target.result;
  db.createObjectStore(DEPENDENCY_OBJECT_STORE_NAME);
};

const openDb = makeOpenDb({
  dbName: DB_NAME,
  dbVersion: DB_VERSION,
  onUpgradeNeeded,
});

export default openDb;
