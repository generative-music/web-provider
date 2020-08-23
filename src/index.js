import has from './has/has';
import request from './request/request';
import makeSave from './save/make-save';

const makeWebProvider = saveWorker => ({
  has,
  request,
  save: makeSave(saveWorker),
});

export default makeWebProvider;
