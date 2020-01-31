import makeProvide from './make-provider';
import makeCanProvide from './make-can-provider';

const makeFetchProvider = ({ origin, dependencyIndex }) => ({
  provide: makeProvide({ origin, dependencyIndex }),
  canProvide: makeCanProvide({ origin, dependencyIndex }),
});

export default makeFetchProvider;
