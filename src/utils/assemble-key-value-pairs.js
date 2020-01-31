const assembleKeyValuePairs = (arr = []) =>
  arr.reduce((assembled, [key, value]) => {
    assembled[key] = value;
    return assembled;
  }, {});

export default assembleKeyValuePairs;
