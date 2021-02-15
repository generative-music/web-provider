# @generative-music/web-provider

An audio sample file provider with caching for use in the browser.

## Usage

The default export of this library is the factory function `createProvider`, which returns [`WebProvider`](#WebProvider) instances. `WebProvider` instances can be used to fetch, cache, and decode audio files.

### `createProvider()`

A factory function which returns a `WebProvider`.

#### Syntax

```javascript
const webProvider = createProvider(saveWorker);
```

##### Parameters

- **`saveWorker`** (optional): An instance of a [`SaveWorker`](#SaveWorker). If omitted, `save` will silently fail.

##### Return value

A [`WebProvider`](#WebProvider) instance.

## `WebProvider`

A `WebProvider` can be used to load, cache, and decode audio files.

### `WebProvider.has()`

The `has` method of the `WebProvider` interface returns a `Promise` that resolves to a boolean value indicating whether or not the provider is currently capable of providing the requested audio files given the current network conditions. The resolved value will be `true` if the client is currently online or if all the audio files are cached locally.

#### Syntax

```javascript
webProvider.has(urls).then(function(result) {
  // Do something with the result
});
```

##### Parameters

- **`urls`**: An array of strings containing URLs to audio files.

##### Return value

A `Promise` which resolves to a boolean indicating whether the provider is currently capable of providing the requested audio files given the current network conditions.

### `WebProvider.request()`

The `request` method of the `WebProvider` interface returns a `Promise` that resolves to an array of `AudioBuffer` instances.

#### Syntax

```javascript
webProvider.request(audioContext, urls).then(function(results) {
  // Do something with the results
});
```

##### Parameters

- **`audioContext`**: An [`AudioContext`](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) object used to create the [`AudioBuffer`] instances.
- **`urls`**: An array of strings containing URLs to audio files.

##### Return value

A `Promise` which resolves to an array of `AudioBuffer` instances of the requested audio files. If an audio file could not be loaded or decoded, it will have a `null` value instead. The resolved array is of the same length as `urls` and in the same order.

### `WebProvider.save()`

The `save` method of the WebProvider interface caches `AudioBuffer` instances for later retrieval via `request`.

> ⚠️ This method requires a instance of [`SaveWorker`](#SaveWorker) to have been passed to `makeWebProvider`. See [`SaveWorker`](#SaveWorker) below.

#### Syntax

```javascript
webProvider.save(cacheEntries).then(function() {
  // The entries were saved!
});
```

##### Parameters

- **`cacheEntries`**: An array of `[key, value]` pairs where `key` is a string and `value` is an `AudioBuffer`.

##### Return value

A promise which resolves to `undefined` once the `cacheEntries` have been saved.

## `SaveWorker`

To enable the `save` method, an instantiated `SaveWorker` must be passed to `makeWebProvider`. Two `SaveWorker` scripts are included at the following locations:

- ESM: `@generative-music/web-provider/worker/save-worker.esm.js`
- CJS: `@generative-music/web-provider/worker/save-worker.cjs.js`

Use the script most appropriate for your configuration.

> ⚠️ The included `SaveWorker` depends on IndexedDB support, though it can be safely instantiated and passed to `makeWebProvider` even if IndexedDB is not supported.

#### Creating a worker

`SaveWorker` is just special a special [WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) used for saving `AudioBuffer` objects.

```javascript
import makeWebProvider from '@generative-music/web-provider';

const saveWorker = new Worker('public/path/to/save-worker.js');

const provider = makeWebProvider(saveWorker);
```

See [MDN: Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) for more information.

##### With webpack and [worker-loader]

In apps using webpack, consider using [worker-loader]:

```javascript
import makeWebProvider from '@generative-music/web-provider';
import SaveWorker from '@generative-music/web-provider/worker/save-worker.esm';

const saveWorker = new SaveWorker();

const provider = makeWebProvider(saveWorker);
```

[worker-loader]: https://www.npmjs.com/package/worker-loader
[unpkg]: unpkg.com
