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
  external: ['@generative-music/sample-index-transformer'],
};

module.exports = config;
