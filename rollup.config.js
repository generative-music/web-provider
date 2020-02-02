'use strict';

const config = {
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

module.exports = config;
