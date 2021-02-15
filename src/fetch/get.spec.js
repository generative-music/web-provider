import get from './get';
import pipe from '../shared/pipe';

const markFetched = url => `${url}::FETCHED`;
const markConvertedToArrayBuffer = url => `${url}::ARRAY_BUFFER`;

const markFetchedAndConvertedToArrayBuffer = pipe(
  markFetched,
  markConvertedToArrayBuffer
);

const URLS = Array.from({ length: 4 }, (_, i) => `/url/${i}`);

describe('fetch/get', () => {
  it('should fetch each url as an array buffer', async () => {
    window.fetch = url =>
      Promise.resolve({
        arrayBuffer: () =>
          Promise.resolve(markFetchedAndConvertedToArrayBuffer(url)),
      });

    const results = await get(URLS);
    expect(results).to.eql(URLS.map(markFetchedAndConvertedToArrayBuffer));
  });
  it('should reject if any urls fail to fetch', async () => {
    const badUrl = '/bad-url/';
    window.fetch = url => {
      if (url === badUrl) {
        return Promise.reject(new Error('Failed to fetch'));
      }
      return Promise.resolve({
        arrayBuffer: () =>
          Promise.resolve(markFetchedAndConvertedToArrayBuffer(url)),
      });
    };
    try {
      await get(URLS.concat([badUrl]));
      assert.fail('Expected getting a bad url to throw');
    } catch (error) {
      expect(error).to.be.an('Error');
    }
  });
  it('should reject if any urls could not be decoded', async () => {
    const badUrl = '/bad-url/';
    window.fetch = url =>
      Promise.resolve({
        arrayBuffer: () => {
          if (url === badUrl) {
            return Promise.reject(
              new Error('Failed to convert to arrayBuffer')
            );
          }
          return Promise.resolve(markFetchedAndConvertedToArrayBuffer(url));
        },
      });
    try {
      await get(URLS.concat([badUrl]));
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
      return;
    }
    assert.fail('Expected getting a bad url to throw');
  });
});
