import assembleKeyValuePairs from './assemble-key-value-pairs';
import makeSplitKeysAndUrls from './make-split-keys-and-urls';

const makeResolveDependencies = (dependencyIndex, resolveUrls) => {
  const splitKeysAndUrls = makeSplitKeysAndUrls(dependencyIndex);
  return (dependencyNames = [], ...additionalArgs) => {
    const [keys, urls] = splitKeysAndUrls(dependencyNames);
    return resolveUrls(urls, ...additionalArgs)
      .then(resolvedUrls => {
        return resolvedUrls.reduce((map, resolvedUrl, i) => {
          const { dependencyName, key } = keys[i];
          const group = map.get(dependencyName);
          const entry = [key, resolvedUrl];
          if (group) {
            map.set(dependencyName, group.concat([entry]));
          } else {
            map.set(dependencyName, [entry]);
          }
          return map;
        }, new Map());
      })
      .then(dependencyMap =>
        Array.from(dependencyMap).reduce(
          (output, [dependencyName, dependencyKeyValuePairs]) => {
            const isArray = Array.isArray(dependencyIndex[dependencyName]);
            if (isArray) {
              output[dependencyName] = dependencyKeyValuePairs.reduce(
                (resolvedDependency, [index, value]) => {
                  resolvedDependency[index] = value;
                  return resolvedDependency;
                },
                []
              );
            } else {
              output[dependencyName] = assembleKeyValuePairs(
                dependencyKeyValuePairs
              );
            }
            return output;
          },
          {}
        )
      );
  };
};

export default makeResolveDependencies;
