import makeCanProvide from './make-can-provide';
import makeProvide from './make-provide';
import makeFetchProvider from '../fetch/make-fetch-provider';

const makeIndexedDbProvider = dependencyIndex => {
  const { canProvide, provide } = makeFetchProvider(dependencyIndex);
  return {
    canProvide: makeCanProvide(dependencyIndex, canProvide),
    provide: makeProvide(dependencyIndex, provide),
  };
};

export default makeIndexedDbProvider;
