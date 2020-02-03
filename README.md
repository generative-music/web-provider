# @generative-music/web-provider

An audio sample file provider with caching for use in the browser.

## Usage

This package exports a [factory function](#factory) which creates [`Provider`s](#provider). The factory requires a single object parameter which adheres to the schema defined in [@generative-music/sample-index-schema](https://github.com/generative-music/sample-index-schema) and contains URLs for audio sample files.

```javascript
import makeProvider from '@generative-music/web-provider';

const sampleIndex = {
  piano: {
    C4: 'url/to/c4.wav',
    C5: 'url/to/c5.wav',
  },
  drum: ['url/to/hit/1.wav', 'url/to/hit/2.wav'],
};

const provider = makeProvider(sampleIndex);
```

## Factory

The default export of this package is a factory function for creating [`Provider`s](#provider).

### `makeProvider()`

The factory function which returns a [`Provider`](#provider) of the specified audio samples.

#### Syntax

```javascript
const provider = makeProvider(sampleIndex);
```

##### Parameters

- **sampleIndex**: An object which adheres to the schema defined in [@generative-music/sample-index-schema](https://github.com/generative-music/sample-index-schema).

##### Return value

A [`Provider`](#provider) instance.

## `Provider`

A `Provider` provides audio samples and caches them locally if the browser supports the [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) (preferred) or [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

### `Provider.canProvide()`

The `canProvide` method of the provider interface returns a `Promise` that resolves to a `Boolean` indicating whether or not the provider is currently capable of providing the requested dependencies. The `Boolean` value will be `true` if all the samples are cached locally or if the browser is online.

#### Syntax

```javascript
provider.canProvide(sampleNames).then(function(result) {
  // Do something with the result
});
```

##### Parameters

- **sampleNames**: An array of strings which correspond to property names in the sample index that was used to create the provider.

##### Return value

A `Promise` that resolves to a `Boolean` indicating whether or not the provider is currently capable of providing the requested audio samples.

### `Provider.provide()`

The `provide` method of the provider interface returns a `Promise` that resolves to an object containing the requested audio samples as `AudioBuffer`s. Audio samples will be retrieved from the cache if available, or through network requests as necessary. If an audio sample is retrieved with a network request and the browser supports the [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) (preferred) or [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), the file will be cached.

#### Syntax

```javascript
provider.provide(sampleNames, audioContext).then(function(result) {
  // Do something with the provided AudioBuffers
});
```

##### Parameters

- **sampleNames**: An array of strings which correspond to property names in the sample index that was used to create the provider.
- **audioContext**: An `AudioContext` object, used to decode the audio sample files.

##### Return value

A `Promise` that resolves to an object with the same structure as the sample index that was used to create the provider, but with each audio sample URL replaced by an `AudioBuffer` of that file.

## Example

This example creates a [Provider](#provider) and uses it to check the availability of some audio samples, and to create a [Tone.js](https://tonejs.github.io/) sampler if the samples can be provided.

```javascript
import Tone from 'tone';
import makeProvider from '@generative-music/web-provider';

const sampleIndex = {
  piano: {
    C4: 'url/to/c4.wav',
    C5: 'url/to/c4.wav',
  },
};

const provider = makeProvider(sampleIndex);

provider.canProvide(['piano']).then(isProvidable => {
  if (isProvidable) {
    return provider.provide(['piano']).then(samples => {
      const sampler = new Tone.Sampler(samples);
    });
  }
  // cannot provide samples!
});
```
