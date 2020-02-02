/* eslint-env mocha */

import expect from 'chai/interface/expect';
import makeResolveDependencies from './make-resolve-dependencies';

describe('resolve dependencies', () => {
  it('should return a structure matching the dependencyIndex with resolved urls', () => {
    const dependencyIndex = {
      dep1: { one: 'dep1/one', two: 'dep2/two' },
      dep2: ['dep2/0', 'dep2/1'],
      dep3: ['beep boop'],
    };
    const markResolved = url => `RESOLVED::${url}`;
    const resolveUrl = url => Promise.resolve(markResolved(url));
    return makeResolveDependencies(dependencyIndex)(
      ['dep1', 'dep2'],
      resolveUrl
    ).then(result => {
      const dependencyNames = Reflect.ownKeys(result);
      expect(dependencyNames).to.have.members(['dep1', 'dep2']);
      dependencyNames.forEach(depName => {
        const resolved = result[depName];
        if (Array.isArray(resolved)) {
          expect(resolved).to.have.ordered.members(
            dependencyIndex[depName].map(url => markResolved(url))
          );
        } else {
          Reflect.ownKeys(resolved).forEach(key => {
            expect(resolved[key]).to.equal(
              markResolved(dependencyIndex[depName][key])
            );
          });
        }
      });
    });
  });
});
