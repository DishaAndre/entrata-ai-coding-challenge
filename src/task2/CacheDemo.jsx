import React, { useState } from 'react';
import { globalCache, fetchWithCache } from './fetchLayer';

export default function CacheDemo() {
  const [filter, setFilter] = useState('all');
  const [logs, setLogs] = useState([]);
  const [mockDb, setMockDb] = useState([
    { id: 1, name: 'Alice', status: 'active' },
    { id: 2, name: 'Bob', status: 'inactive' },
  ]);

  const addLog = (message, type) => {
    setLogs((prev) => [
      { id: Date.now(), message, type, time: new Date().toLocaleTimeString() },
      ...prev,
    ]);
  };

  // Mocked backend network request handler
  const mockFetchServer = async (endpoint, params, headers) => {
    const filteredData = params.status 
      ? mockDb.filter((u) => u.status === params.status)
      : mockDb;

    const generatedETag = `W/"${JSON.stringify(filteredData).length}"`;

    // Simulate 304 Not Modified if ETag matches
    if (headers['If-None-Match'] === generatedETag) {
      return { status: 304, data: null, headers: { etag: generatedETag } };
    }

    return { status: 200, data: filteredData, headers: { etag: generatedETag } };
  };

  const handleFetch = async () => {
    const endpoint = '/api/users';
    const params = filter !== 'all' ? { status: filter } : {};

    const result = await fetchWithCache(endpoint, params, mockFetchServer);

    if (result.source === 'cache') {
      addLog(`CACHE HIT [${filter}]: Returned ${result.data.length} items from cache`, 'hit');
    } else if (result.source === 'etag-revalidated') {
      addLog(`ETAG 304 NOT MODIFIED [${filter}]: Revalidated cache via ETag`, 'hit');
    } else {
      addLog(`CACHE MISS / NETWORK FETCH [${filter}]: Fetched ${result.data.length} items from server`, 'miss');
    }
  };

  const handleMutation = () => {
    const newUser = { id: Date.now(), name: `User_${mockDb.length + 1}`, status: 'active' };
    setMockDb((prev) => [...prev, newUser]);

    // Invalidate matching endpoints in cache
    globalCache.invalidate('/api/users');
    addLog('MUTATION EXECUTED: Added new user & invalidated /api/users cache', 'mutation');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Task 2: Cache & Mutation Layer</h2>
      
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm h-[40px]"
        >
          <option value="all">All Items</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>

        <button
          onClick={handleFetch}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition shadow-sm h-[40px]"
        >
          Fetch Data (Filter: {filter})
        </button>

        <button
          onClick={handleMutation}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition shadow-sm h-[40px]"
        >
          Add Item (Trigger Mutation)
        </button>
      </div>

      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs h-48 overflow-y-auto space-y-2">
        {logs.length === 0 ? (
          <p className="text-gray-500">Click actions above to inspect cache lifecycle logs...</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-2">
              <span className="text-gray-400">[{log.time}]</span>
              <span
                className={
                  log.type === 'hit'
                    ? 'text-green-400 font-bold'
                    : log.type === 'miss'
                    ? 'text-yellow-400 font-bold'
                    : 'text-purple-400 font-bold'
                }
              >
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}