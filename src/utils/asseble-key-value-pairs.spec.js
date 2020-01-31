/*eslint-env mocha*/

import expect from 'chai/interface/expect';
import assembleKeyValuePairs from './assemble-key-value-pairs';

describe('assembleKeyValue', () => {
  it('should create an object from an array of [key, value] pairs', () => {
    expect(
      assembleKeyValuePairs([
        ['one', 1],
        ['two', 2],
      ])
    ).to.eql({ one: 1, two: 2 });
  });
});
