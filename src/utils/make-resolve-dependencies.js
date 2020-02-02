import transformDependencyIndex from './transform-dependency-index';

const makeResolveDependencies = dependencyIndex => (
  dependencyNames = [],
  resolveDependencyValue
) => {
  const dependencyNameSet = new Set(dependencyNames);
  const subIndex = Reflect.ownKeys(dependencyIndex)
    .filter(dependencyName => dependencyNameSet.has(dependencyName))
    .reduce((newIndex, dependencyName) => {
      newIndex[dependencyName] = dependencyIndex[dependencyName];
      return newIndex;
    }, {});
  return transformDependencyIndex(subIndex, resolveDependencyValue);
};

export default makeResolveDependencies;
