import React, { useState } from 'react';
import { Search, Filter, GitPullRequest, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GitHubPullRequest } from '../types';

const PullRequests: React.FC = () => {
  const { repositories, pullRequests } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  const allPullRequests = Object.entries(pullRequests).flatMap(([repoPath, prs]) => {
    const [owner, name] = repoPath.split('/');
    return prs.map(pr => ({ ...pr, owner, repoName: name }));
  });
  
  const filteredPullRequests = allPullRequests.filter(pr => 
    pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pr.repoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pr.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pr.number.toString().includes(searchTerm)
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="flex items-center">
          <GitPullRequest size={24} className="mr-2" />
          Pull Requests
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
              placeholder="Search pull requests..."
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
      
      {repositories.length === 0 ? (
        <div className="text-center py-10 card">
          <AlertCircle size={48} className="mx-auto text-github-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-github-gray-700">No repositories configured</h3>
          <p className="text-github-gray-500 mt-1">
            Add a repository in settings to start monitoring pull requests.
          </p>
        </div>
      ) : filteredPullRequests.length === 0 ? (
        <div className="text-center py-10 card">
          <GitPullRequest size={48} className="mx-auto text-github-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-github-gray-700">No pull requests found</h3>
          <p className="text-github-gray-500 mt-1">
            {searchTerm ? 'Try adjusting your search or filters' : 'No open pull requests in your repositories'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPullRequests.map((pr: GitHubPullRequest & { owner: string; repoName: string }) => (
            <div key={`${pr.owner}/${pr.repoName}#${pr.number}`} className="card p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-github-gray-900">
                    {pr.owner}/{pr.repoName} #{pr.number}
                  </div>
                  <div className="text-github-gray-600 mt-1">
                    {pr.title}
                  </div>
                </div>
                <a
                  href={pr.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PullRequests;