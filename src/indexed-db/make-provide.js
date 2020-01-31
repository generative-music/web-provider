import openDb from './open-db';
import DEPENDENCY_OBJECT_STORE_NAME from './dependency-object-store-name';
import assembleKeyValuePairs from '../utils/assemble-key-value-pairs';

const promisifyTransaction = request =>
  new Promise(resolve => {
    const handleSuccess = event => {
      request.removeEventListener('success', handleSuccess);
      resolve(event.target.result);
    };
    request.addEventListener('success', handleSuccess);
  });

const getCachedDependency = dependencyName =>
  openDb().then(db =>
    promisifyTransaction(
      db
        .transaction([DEPENDENCY_OBJECT_STORE_NAME])
        .objectStore(DEPENDENCY_OBJECT_STORE_NAME)
        .get(dependencyName)
    )
  );

const addCacheDependency = (dependencyName, dependency) =>
  openDb().then(db =>
    promisifyTransaction(
      db
        .transaction([DEPENDENCY_OBJECT_STORE_NAME])
        .objectStore(DEPENDENCY_OBJECT_STORE_NAME)
        .put(dependency, dependencyName)
    )
  );

const decodeArray = (cachedDependency, audioContext) =>
  Promise.all(
    cachedDependency.map(arrayBuffer =>
      audioContext.decodeAudioData(arrayBuffer)
    )
  );

const decodeObject = (cachedDependency, audioContext) =>
  Promise.all(
    Reflect.ownKeys(key =>
      audioContext
        .decodeAudioData(cachedDependency[key])
        .then(audioBuffer => [key, audioBuffer])
    )
  ).then(decoded => assembleKeyValuePairs(decoded));

const makeProvide = ({ fetchProvider }) => (dependencyNames, audioContext) =>
  Promise.all(
    dependencyNames.map(dependencyName =>
      getCachedDependency(dependencyName)
        .then(dependency => {
          if (dependency === null) {
            return fetchProvider
              .provide([dependencyName], audioContext)
              .then(fetchedDependency =>
                addCacheDependency(dependencyName, fetchedDependency).then(
                  () => fetchedDependency
                )
              );
          }
          return (Array.isArray(dependency) ? decodeArray : decodeObject)(
            dependency,
            audioContext
          );
        })
        .then(dependency => [dependencyName, dependency])
    )
  ).then(decoded => assembleKeyValuePairs(decoded));

export default makeProvide;
