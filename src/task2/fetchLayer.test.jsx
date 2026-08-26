import { describe, it, expect, beforeEach } from 'vitest';
import { QueryCache } from './fetchLayer';

describe('Task 2: QueryCache Layer', () => {
  let cache;

  beforeEach(() => {
    cache = new QueryCache(1000); // 1s TTL
  });

  it('differentiates keys based on query parameters', () => {
    cache.set('/api/items', { page: 1 }, ['item1']);
    cache.set('/api/items', { page: 2 }, ['item2']);

    const res1 = cache.get('/api/items', { page: 1 });
    const res2 = cache.get('/api/items', { page: 2 });

    expect(res1.data).toEqual(['item1']);
    expect(res2.data).toEqual(['item2']);
  });

  it('invalidates matching cached endpoint entries on mutation', () => {
    cache.set('/api/users', { status: 'active' }, [{ id: 1 }]);
    cache.set('/api/users', { status: 'inactive' }, [{ id: 2 }]);

    cache.invalidate('/api/users');

    expect(cache.get('/api/users', { status: 'active' })).toBeNull();
    expect(cache.get('/api/users', { status: 'inactive' })).toBeNull();
  });
});