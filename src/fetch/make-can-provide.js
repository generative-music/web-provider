const isOnline = () =>
  window.navigator &&
  (typeof window.navigator.onLine === 'undefined' || window.navigator.onLine);

const LOCALHOST_REGEX = /^https?:\/\/localhost(:[d]+)?/;

const makeCanProvide = ({ origin = '', dependencyIndex }) => {
  if (LOCALHOST_REGEX.test(origin)) {
    return () => Promise.resolve(true);
  }
  return (dependencies = []) =>
    Promise.resolve(
      dependencies.length === 0 ||
        (isOnline() &&
          dependencies.every(dependencyName => dependencyIndex[dependencyName]))
    );
};

export default makeCanProvide;
