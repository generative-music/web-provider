/*eslint-env mocha*/

import expect from 'chai/interface/expect';
import transformDependencyIndex from './transform-dependency-index';

describe('transformDependencyIndex', () => {
  it('should apply the transformation to the dependency values and return the same structure', () => {
    const inputIndex = {
      dep1: {
        url1: 'dep1/url1',
        url2: 'dep1/url2',
      },
      dep2: ['dep2/url1', 'dep2/url2'],
    };
    const transform = input => `${input}::TRANSFORMED`;
    return transformDependencyIndex(inputIndex, (...args) =>
      Promise.resolve(transform(...args))
    ).then(output => {
      Reflect.ownKeys(inputIndex).forEach(dependencyName => {
        expect(output).to.have.property(dependencyName);
        if (Array.isArray(inputIndex[dependencyName])) {
          expect(output[dependencyName]).to.have.ordered.members(
            inputIndex[dependencyName].map(value => transform(value))
          );
        } else {
          Reflect.ownKeys(inputIndex[dependencyName]).forEach(key => {
            expect(output[dependencyName]).to.have.property(
              key,
              transform(inputIndex[dependencyName][key])
            );
          });
        }
      });
    });
  });
});
