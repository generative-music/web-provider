# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- None

## [2.0.2] - 2020-09-14

### Fixed

- Replace `window` reference with `self` in the worker.

## [2.0.1] - 2020-08-24

### Fixed

- Add `audioContext` to `WebProvider.request()` in the README.

## [2.0.0] - 2020-08-23

### Changed

- Complete rewrite with new API.

## [1.1.0] - 2020-06-16

### Added

- New [@generative-music/sample-index-transformer](https://github.com/generative-music/sample-index-transformer) dependency.

## [1.0.0] - 2020-02-02

### Removed

- `makeCacheProvider`, `makeIndexedDbProvider`, and `makeFetchProvider` named exports.

### Added

- `makeProvider` default export which feature-detects and selects the best provider type.

## [0.1.0] - 2020-02-02

### Added

- Initial release with three separate providers.

[unreleased]: https://github.com/generative-music/web-provider/compare/v2.0.2...HEAD
[2.0.2]: https://github.com/generative-music/web-provider/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/generative-music/web-provider/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/generative-music/web-provider/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/generative-music/web-provider/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/generative-music/web-provider/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/generative-music/web-provider/releases/tag/v0.0.1
