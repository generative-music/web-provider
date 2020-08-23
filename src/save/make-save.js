import isSupported from '../indexed-db/is-supported';
import save from '../indexed-db/save';

const makeSave = worker =>
  isSupported ? save.bind(null, worker) : () => Promise.resolve();

export default makeSave;
