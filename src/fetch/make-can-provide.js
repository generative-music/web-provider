const isOnline = () =>
  window.navigator &&
  (typeof window.navigator.onLine === 'undefined' || window.navigator.onLine);

const LOCALHOST_REGEX = /^https?:\/\/localhost(:[d]+)?/;

const isEmpty = ({ length }) => length === 0;

const makeCanProvide = dependencyIndex => {
  const isAllLocal = dependencyNames =>
    dependencyNames.every(dependencyName => {
      const dependency = dependencyIndex[dependencyName];
      if (Array.isArray(dependency)) {
        return dependency.every(url => LOCALHOST_REGEX.test(url));
      }
      return Object.values(dependency).every(url => LOCALHOST_REGEX.test(url));
    });

  const isAllExisting = dependencyNames =>
    dependencyNames.every(dependencyName =>
      Boolean(dependencyIndex[dependencyName])
    );
  return (dependencyNames = []) =>
    Promise.resolve(
      isEmpty(dependencyNames) ||
        (isAllExisting(dependencyNames) &&
          (isOnline() || isAllLocal(dependencyNames)))
    );
};

export default makeCanProvide;
