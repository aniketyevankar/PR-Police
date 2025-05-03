import React, { useState } from 'react';
import { Search, Filter, History as HistoryIcon, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';

const History: React.FC = () => {
  const { executions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredExecutions = executions.filter(execution => 
    execution.pullRequestTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    execution.repository.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    execution.repository.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    execution.pullRequestNumber.toString().includes(searchTerm)
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="flex items-center">
          <HistoryIcon size={24} className="mr-2" />
          History
        </h1>
      </div>
      
      <div className="mt-4 mb-6">
        <div className="flex items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-github-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-github-gray-300 rounded-md text-sm placeholder-github-gray-400 focus:outline-none focus:ring-2 focus:ring-github-blue focus:border-github-blue"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="ml-3 btn-secondary">
            <Filter size={16} className="mr-1" />
            Filter
          </button>
        </div>
      </div>
      
      {filteredExecutions.length === 0 ? (
        <div className="text-center py-10 card">
          <HistoryIcon size={48} className="mx-auto text-github-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-github-gray-700">No history found</h3>
          <p className="text-github-gray-500 mt-1">
            {searchTerm ? 'Try adjusting your search or filters' : 'No code review executions yet'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredExecutions.map(execution => (
            <div key={execution.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-github-gray-900">
                    {execution.repository.owner}/{execution.repository.name} #{execution.pullRequestNumber}
                  </div>
                  <div className="text-github-gray-600 mt-1">
                    {execution.pullRequestTitle}
                  </div>
                  <div className="text-github-gray-500 text-sm mt-2">
                    {formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  execution.status === 'completed' && execution.success
                    ? 'bg-github-green/10 text-github-green'
                    : execution.status === 'failed'
                    ? 'bg-github-red/10 text-github-red'
                    : 'bg-github-gray-100 text-github-gray-700'
                }`}>
                  {execution.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;