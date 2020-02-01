import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';

const DB_VERSION = 1;
const DB_NAME = '@generative-music/web-provider::cache';

const attachUpgradeNeededHandler = openRequest => {
  const handleUpgradeNeeded = event => {
    openRequest.removeEventListener('upgradeneeded', handleUpgradeNeeded);
    const db = event.target.result;
    db.createObjectStore(DEPENDENCY_OBJECT_STORE_NAME);
  };
  openRequest.addEventListener('upgradeneeded', handleUpgradeNeeded);
};

const openDb = () =>
  new Promise(resolve => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    const handleSuccess = event => {
      request.removeEventListener('success', handleSuccess);
      resolve(event.target.result);
    };
    request.addEventListener('success', handleSuccess);
    attachUpgradeNeededHandler(request);
  });

export default openDb;
