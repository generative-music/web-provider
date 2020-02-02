import makeCanProvide from './make-can-provide';
import makeProvide from './make-provide';
import makeCanProvideFresh from '../fetch/make-can-provide';

const makeCacheProvider = dependencyIndex => {
  const canProvideFresh = makeCanProvideFresh(dependencyIndex);
  return {
    canProvide: makeCanProvide(dependencyIndex, canProvideFresh),
    provide: makeProvide(dependencyIndex),
  };
};

export default makeCacheProvider;
