import makeCanProvide from './make-can-provide';
import makeProvide from './make-provide';
import makeCanProvideFresh from '../fetch/make-can-provide';

const fetchArrayBuffer = url =>
  window.fetch(url).then(response => response.arrayBuffer());

const makeIndexedDbProvider = dependencyIndex => {
  const canProvideFresh = makeCanProvideFresh(dependencyIndex);

  return {
    canProvide: makeCanProvide(dependencyIndex, canProvideFresh),
    provide: makeProvide(dependencyIndex, fetchArrayBuffer),
  };
};

export default makeIndexedDbProvider;
