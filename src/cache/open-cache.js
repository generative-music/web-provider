const CACHE_NAME = '@generative-music/web-provider::cache';

const openCache = () => window.caches.open(CACHE_NAME);

export default openCache;
