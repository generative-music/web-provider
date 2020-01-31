import fetchAudioBuffer from './fetch-audio-buffer';
import assembleKeyValuePairs from '../utils/assemble-key-value-pairs';

const fetchArray = (dependency, origin, audioContext) =>
  Promise.all(
    dependency.map(url => fetchAudioBuffer(`${origin}/${url}`, audioContext))
  );

const fetchObject = (dependency, origin, audioContext) =>
  Promise.all(
    Reflect.ownKeys(dependency).map(key =>
      fetchAudioBuffer(
        `${origin}/${dependency[key]}`,
        audioContext
      ).then(audioBuffer => [key, audioBuffer])
    )
  ).then(fetched => assembleKeyValuePairs(fetched));

const makeProvide = ({ origin, dependencyIndex }) => (
  dependencies,
  audioContext
) =>
  Promise.all(
    dependencies.map(dependencyName => {
      const dependency = dependencyIndex[dependencyName];
      return (Array.is(dependency) ? fetchArray : fetchObject)(
        dependency,
        origin,
        audioContext
      ).then(fetchedDependency => [dependencyName, fetchedDependency]);
    })
  ).then(fetched => assembleKeyValuePairs(fetched));

export default makeProvide;
