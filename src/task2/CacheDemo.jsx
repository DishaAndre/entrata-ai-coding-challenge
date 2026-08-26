import React, { useState } from 'react';
import { globalCache } from './fetchLayer';

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

  const fetchData = async (statusFilter) => {
    const endpoint = '/api/users';
    const params = statusFilter !== 'all' ? { status: statusFilter } : {};
    const cached = globalCache.get(endpoint, params);

    if (cached && !cached.isStale) {
      addLog(`CACHE HIT [${statusFilter}]: Returned ${cached.data.length} items`, 'hit');
      return;
    }

    // Mock API Fetch
    const filteredData = statusFilter === 'all' 
      ? mockDb 
      : mockDb.filter((u) => u.status === statusFilter);

    globalCache.set(endpoint, params, filteredData);
    addLog(`CACHE MISS [${statusFilter}]: Fetched ${filteredData.length} items from server`, 'miss');
  };

  const handleMutation = () => {
    const newUser = { id: Date.now(), name: `User_${mockDb.length + 1}`, status: 'active' };
    setMockDb((prev) => [...prev, newUser]);
    
    // Invalidate cache for updated resource endpoint
    globalCache.invalidate('/api/users');
    addLog('MUTATION EXECUTED: Added new user & invalidated /api/users cache', 'mutation');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Task 2: Cache & Mutation Layer</h2>
      
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => fetchData(filter)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
        >
          Fetch Data (Filter: {filter})
        </button>
        <button
          onClick={handleMutation}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition"
        >
          Add Item (Trigger Mutation)
        </button>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="all">All</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
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