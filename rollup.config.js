'use strict';

const workerConfig = {
  input: './src/indexed-db/save.worker.js',
  output: [
    {
      format: 'esm',
      file: `./worker/save-worker.esm.js`,
    },
    {
      format: 'cjs',
      file: `./worker/save-worker.cjs.js`,
    },
  ],
  external: ['lamejs'],
};

const pkgConfig = {
  input: './src/index.js',
  output: [
    {
      format: 'esm',
      file: `./dist/web-provider.esm.js`,
    },
    {
      format: 'cjs',
      file: `./dist/web-provider.cjs.js`,
    },
  ],
};

module.exports = [workerConfig, pkgConfig];
