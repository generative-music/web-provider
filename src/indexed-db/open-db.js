import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';

const DB_VERSION = 1;
const DB_NAME = '@generative-music/web-provider::cache';

const handleUpgradeNeeded = event => {
  const db = event.target.result;
  db.createObjectStore(DEPENDENCY_OBJECT_STORE_NAME);
};

const openDb = () =>
  new Promise((resolve, reject) => {
    const request = window.indexedDb.open(DB_NAME, DB_VERSION);
    request.addEventListener('upgradeneeded', () => {});
  });
