const isOnline = () => Boolean(window.navigator.onLine);
const isLocalUrl = url => /^https?:\/\/localhost(:[d]+)?/.test(url);
const isEmpty = ({ length }) => length === 0;

const has = (sampleIndex = {}, instrumentNames = []) => {
  if (isEmpty(instrumentNames)) {
    return Promise.resolve(true);
  }
  let areAllLocal = true;
  const areAllValid = instrumentNames.every(instrumentName => {
    const sampleCollection = sampleIndex[instrumentName];
    if (Array.isArray(sampleCollection)) {
      areAllLocal = areAllLocal && sampleCollection.every(isLocalUrl);
      return true;
    }
    if (sampleCollection !== null && typeof sampleCollection === 'object') {
      areAllLocal =
        areAllLocal && Object.values(sampleCollection).every(isLocalUrl);
      return true;
    }
    return false;
  });
  return Promise.resolve(areAllValid && (areAllLocal || isOnline()));
};

export default has;
