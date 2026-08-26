// Lightweight QueryCache class with ETag support
export class QueryCache {
  constructor(defaultTTL = 5000) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  // Generate canonical key sorted by query params
  buildKey(endpoint, params = {}) {
    const sortedKeys = Object.keys(params).sort();
    const queryString = sortedKeys
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    return queryString ? `${endpoint}?${queryString}` : endpoint;
  }

  get(endpoint, params = {}) {
    const key = this.buildKey(endpoint, params);
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isStale = Date.now() - entry.timestamp > entry.ttl;
    return { ...entry, isStale };
  }

  set(endpoint, params = {}, data, etag = null, ttl = this.defaultTTL) {
    const key = this.buildKey(endpoint, params);
    this.cache.set(key, {
      data,
      etag,
      timestamp: Date.now(),
      ttl,
    });
  }

  // Validate cache entry against incoming response ETag
  validateETag(endpoint, params = {}, incomingETag) {
    const entry = this.get(endpoint, params);
    if (entry && entry.etag && entry.etag === incomingETag) {
      return true; // 304 Not Modified equivalent
    }
    return false;
  }

  invalidate(prefix) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }
}

export const globalCache = new QueryCache();

// Actual data-fetch layer with mocked fetch()
export async function fetchWithCache(endpoint, params = {}, mockNetworkFn) {
  const cached = globalCache.get(endpoint, params);

  // Return non-stale cached data immediately
  if (cached && !cached.isStale) {
    return { data: cached.data, source: 'cache', status: 200 };
  }

  // Prepare ETag headers for revalidation if cached entry exists
  const headers = {};
  if (cached?.etag) {
    headers['If-None-Match'] = cached.etag;
  }

  // Mocked fetch execution simulating network request
  const response = await mockNetworkFn(endpoint, params, headers);

  // Handle 304 Not Modified via ETag match
  if (response.status === 304 && cached) {
    // Refresh timestamp
    globalCache.set(endpoint, params, cached.data, cached.etag);
    return { data: cached.data, source: 'etag-revalidated', status: 304 };
  }

  // Cache new fresh response data with optional ETag header from response
  const etag = response.headers?.etag || `W/"${JSON.stringify(response.data).length}"`;
  globalCache.set(endpoint, params, response.data, etag);

  return { data: response.data, source: 'network', status: 200 };
}