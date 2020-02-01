import makeCanProvide from './make-can-provider';
import makeProvider from '../utils/make-provider';

const makeFetchProvider = dependencyIndex => ({
  canProvide: makeCanProvide(dependencyIndex),
  provide: makeProvider(dependencyIndex),
});

export default makeFetchProvider;
