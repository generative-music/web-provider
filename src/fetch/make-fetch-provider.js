import makeCanProvide from './make-can-provide';
import makeProvide from './make-provide';

const makeFetchProvider = dependencyIndex => ({
  canProvide: makeCanProvide(dependencyIndex),
  provide: makeProvide(dependencyIndex),
});

export default makeFetchProvider;
