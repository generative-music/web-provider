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
  it('should return null for any urls which failed to fetch', async () => {
    const badUrl = '/bad-url/';
    window.fetch = url => {
      if (url === badUrl) {
        return Promise.reject(Error('Failed to fetch'));
      }
      return Promise.resolve({
        arrayBuffer: () =>
          Promise.resolve(markFetchedAndConvertedToArrayBuffer(url)),
      });
    };
    const results = await get(URLS.concat([badUrl]));

    expect(results).to.eql(
      URLS.map(markFetchedAndConvertedToArrayBuffer).concat([null])
    );
  });
  it('should return null for any urls which could not be fetched as an array buffer', async () => {
    const badUrl = '/bad-url/';
    window.fetch = url =>
      Promise.resolve({
        arrayBuffer: () => {
          if (url === badUrl) {
            return Promise.reject(Error('Failed to convert to arrayBuffer'));
          }
          return Promise.resolve(markFetchedAndConvertedToArrayBuffer(url));
        },
      });

    const results = await get(URLS.concat([badUrl]));
    expect(results).to.eql(
      URLS.map(markFetchedAndConvertedToArrayBuffer).concat([null])
    );
  });
});
