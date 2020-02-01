/* eslint-env mocha */

import expect from 'chai/interface/expect';
import makeSplitKeysAndUrls from './make-split-keys-and-urls';

describe('splitKeysAndUrls', () => {
  const dependencyIndex = {
    dep1: { one: 'dep1/one', two: 'dep1/two' },
    dep2: ['dep2/0', 'dep2/1'],
    dep3: ['dep3/0'],
  };
  it('should return two arrays of equal length', () => {
    const [keys, urls] = makeSplitKeysAndUrls(dependencyIndex)([
      'dep1',
      'dep2',
    ]);
    expect(keys.length).to.equal(urls.length);
  });

  it('should return every key and url of the requested dependencies', () => {
    const [keys, urls] = makeSplitKeysAndUrls(dependencyIndex)([
      'dep1',
      'dep2',
    ]);
    expect(keys).to.have.deep.members([
      { dependencyName: 'dep1', key: 'one' },
      { dependencyName: 'dep1', key: 'two' },
      { dependencyName: 'dep2', key: 0 },
      { dependencyName: 'dep2', key: 1 },
    ]);
    expect(urls).to.have.members(['dep1/one', 'dep1/two', 'dep2/0', 'dep2/1']);
  });
});
