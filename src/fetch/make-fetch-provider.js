import has from './has';
import request from './request';

const save = () => {
  /* do nothing */
};

const makeFetchProvider = dependencyIndex => ({
  has: has.bind(null, dependencyIndex),
  request: request.bind(null, dependencyIndex),
  save,
});

export default makeFetchProvider;
