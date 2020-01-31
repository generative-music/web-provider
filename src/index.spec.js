/* eslint-env mocha */

import expect from 'chai/interface/expect';
import getThing from './index';

describe('getThing', () => {
  it('should be hello', () => {
    expect(getThing()).to.equal('hello');
  });
});
