import React, { useState } from 'react';
import { Search, Inbox, Filter, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ExecutionCard from '../components/ExecutionCard';

const Dashboard: React.FC = () => {
  const { executions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  const runningExecutions = executions.filter(execution => execution.status === 'running');
  const completedExecutions = executions.filter(execution => execution.status !== 'running');
  
  const filteredExecutions = completedExecutions.filter(execution => 
    execution.pullRequestTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    execution.repository.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    execution.repository.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    execution.pullRequestNumber.toString().includes(searchTerm)
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Dashboard</h1>
        <button className="btn-primary">
          <Plus size={16} className="mr-1" />
          New Review
        </button>
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
              placeholder="Search executions..."
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
      
      {runningExecutions.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-4">Live Executions</h2>
          <div className="grid gap-4 mb-8">
            {runningExecutions.map(execution => (
              <ExecutionCard key={execution.id} execution={execution} />
            ))}
          </div>
        </>
      )}
      
      <h2 className="text-lg font-semibold mb-4">Recent Executions</h2>
      {filteredExecutions.length === 0 ? (
        <div className="text-center py-10 card">
          <Inbox size={48} className="mx-auto text-github-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-github-gray-700">No executions found</h3>
          <p className="text-github-gray-500 mt-1">
            {searchTerm ? 'Try adjusting your search or filters' : 'Start a new code review to see executions here'}
          </p>
          {!searchTerm && (
            <button className="btn-primary mt-4">
              <Plus size={16} className="mr-1" />
              New Review
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredExecutions.map(execution => (
            <ExecutionCard key={execution.id} execution={execution} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;