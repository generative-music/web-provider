# @generative-music/web-provider

A collection of audio sample file providers for use in the browser.

## Usage

The package exports three [factory functions](#provider-factories) for three different providers: [`makeCacheProvider`](#cache-provider), [`makeIndexedDbProvider`](#indexed-db-provider), and [`makeFetchProvider`](#fetch-provider).

```javascript
import {
  makeCacheProvider,
  makeIndexedDbProvider,
  makeFetchProvider,
} from '@generative-music/web-provider';
```

Each factory requires a single object parameter which adheres to the schema defined in [@generative-music/sample-index-schema](https://github.com/generative-music/sample-index-schema) and returns a [provider](#provider-interface).

```javascript
const sampleIndex = {
  piano: {
    C4: 'url/to/c4.wav',
    C5: 'url/to/c5.wav',
  },
  drum: ['url/to/hit/1.wav', 'url/to/hit/2.wav'],
};

const cacheProvider = makeCacheProvider(sampleIndex);
const indexedDbProvider = makeIndexedDbProvider(sampleIndex);
const fetchProvider = makeFetchProvider(sampleIndex);
```

## `Provider` factories

Each type of provider has a factory function for creating instances of that provider type.

### `makeProvider()`

The factory function for each provider returns a [`Provider`](#provider-interface) instance.

#### Syntax

```javascript
const provider = makeProvider(sampleIndex);
```

##### Parameters

- **sampleIndex**: An object which adheres to the schema defined in [@generative-music/sample-index-schema](https://github.com/generative-music/sample-index-schema).

##### Return value

A [`Provider`](#provider-interface) instance.

## `Provider` interface

All types of providers have the same interface.

### `provider.canProvide()`

The `canProvide` method of the provider interface returns a `Promise` that resolves to a `Boolean` indicating whether or not the provider is currently capable of providing the requested dependencies.

#### Syntax

```javascript
provider.canProvide(sampleNames).then(function(result) {
  // Do something with the result
});
```

##### Parameters

- **sampleNames**: An array of strings which correspond to property names in the sample index that was used to create the provider.

##### Return value

A `Promise` that resolves to a `Boolean` indicating whether or not the provider is currently capabable of providing the requested audio samples.

### `provider.provide()`

The `provide` method of the provider interface returns a `Promise` that resolves to an object containing the requested audio samples as `AudioBuffer`s.

#### Syntax

```javascript
provider.provide(sampleNames, audioContext).then(function(result) {
  // Do something with the provided AudioBuffers
});
```

##### Parameters

- **sampleNames**: An array of strings which correspond to property names in the sample index that was used to create the provider.
- **audioContext**: An `AudioContext` object.

##### Return value

A `Promise` that resolves to an object with the same structure as the sample index that was used to create the provider, but with each audio sample provided as an `AudioBuffer`.

## Providers

### Cache provider

```javascript
import { makeCacheProvider } from '@generative-music/web-provider';
```

The cache provider uses the [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) to cache network responses. Audio samples are retrieved from the cached responses when possible, otherwise they're fetched with a network request.

### IndexedDB provider

```javascript
import { makeIndexedDbProvider } from '@generative-music/web-provider';
```

The IndexedDB provider uses the [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) to cache audio samples. Audio samples are retrieved from the cache when possible, otherwise they're fetched with a network request.

### Fetch provider

```javascript
import { makeFetchProvider } from '@generative-music/web-provider';
```

The fetch provider uses the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to retrieve audio samples with network requests.

## Examples

### Creating and using a provider

This example creates an [IndexedDB provider](#indexed-db-provider) and uses it to check the availability of some audio samples, and to create a [Tone.js](https://tonejs.github.io/) sampler if the samples can be provided.

```javascript
import Tone from 'tone';
import { makeIndexedDbProvider } from '@generative-music/web-provider';

const sampleIndex = {
  piano: {
    C4: 'url/to/c4.wav',
    C5: 'url/to/c4.wav',
  },
};

const indexedDbProvider = makeIndexedDbProvider(sampleIndex);

indexedDbProvider.canProvide(['piano']).then(isProvidable => {
  if (isProvidable) {
    return indexedDbProvider.provide(['piano']).then(samples => {
      const sampler = new Tone.Sampler(samples);
    });
  }
  // cannot provide samples!
});
```

### Selecting the best provider

This example will create a cache provider if the Cache API is supported.
If the Cache API is not supported and the IndexedDB API is supported, it will create an IndexedDB provider.
Otherwise, it will create a fetch provider.

```javascript
import {
  makeCacheProvider,
  makeIndexedDbProvider,
  makeFetchProvider,
} from '@generative-music/web-provider';

let makeProvider = fetchProvider;
if (window.caches) {
  makeProvider = makeCacheProvider;
} else if (window.indexedDB) {
  makeProvider = makeIndexedDbProvider;
}

const provider = makeProvider({
  drum: ['url/to/1.wav'],
});
```
