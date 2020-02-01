const makeSplitKeysAndUrls = dependencyIndex => dependencyNames =>
  dependencyNames.reduce(
    ([keys, urls], dependencyName) => {
      const dependency = dependencyIndex[dependencyName];
      if (Array.isArray(dependency)) {
        return dependency.reduce(
          ([innerKeys, innerUrls], url, i) => [
            innerKeys.concat({ dependencyName, key: i }),
            innerUrls.concat([url]),
          ],
          [keys, urls]
        );
      }
      return Reflect.ownKeys(dependency).reduce(
        ([innerKeys, innerUrls], key) => [
          innerKeys.concat({ dependencyName, key }),
          innerUrls.concat([dependency[key]]),
        ],
        [keys, urls]
      );
    },
    [[], []]
  );

export default makeSplitKeysAndUrls;
