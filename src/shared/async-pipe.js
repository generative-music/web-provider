const asyncPipe = (...fns) => x =>
  fns.reduce((y, fn) => y.then(fn), Promise.resolve(x));

export default asyncPipe;
