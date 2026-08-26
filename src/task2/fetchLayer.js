export class QueryCache {
  constructor(ttlMs = 5000) {
    this.cache = new Map();
    this.ttlMs = ttlMs;
  }

  // Generate unique keys including query parameters
  generateKey(endpoint, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    return sortedParams ? `${endpoint}?${sortedParams}` : endpoint;
  }

  get(endpoint, params = {}) {
    const key = this.generateKey(endpoint, params);
    const entry = this.cache.get(key);

    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.ttlMs;
    return { ...entry, isStale: isExpired };
  }

  set(endpoint, params = {}, data, etag = null) {
    const key = this.generateKey(endpoint, params);
    this.cache.set(key, {
      data,
      etag,
      timestamp: Date.now(),
    });
  }

  // Invalidate specific cache keys or all queries matching an endpoint prefix
  invalidate(endpointPrefix) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(endpointPrefix)) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }
}

export const globalCache = new QueryCache();