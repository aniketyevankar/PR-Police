import React, { useState } from 'react';
import { 
  Save, 
  Key, 
  Github, 
  Plus, 
  Trash2, 
  Webhook, 
  Lock,
  Settings,
  Server,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../utils/cn';
import { useApp } from '../context/AppContext';
import AddRepositoryDialog from '../components/AddRepositoryDialog';

const Configuration: React.FC = () => {
  const { repositories, addRepository, removeRepository } = useApp();
  const [activeTab, setActiveTab] = useState('repositories');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://app.codereview.dev/webhook/github');
  const [isAddRepoOpen, setIsAddRepoOpen] = useState(false);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show a toast or feedback
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Configuration</h1>
        <button className="btn-primary">
          <Save size={16} className="mr-1" />
          Save Changes
        </button>
      </div>
      
      <div className="card overflow-hidden">
        <div className="flex border-b border-github-gray-200">
          <button
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 border-transparent",
              activeTab === 'general' && "border-github-blue text-github-blue"
            )}
            onClick={() => setActiveTab('general')}
          >
            <Settings size={16} className="inline-block mr-1.5 -mt-0.5" />
            General
          </button>
          <button
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 border-transparent",
              activeTab === 'api' && "border-github-blue text-github-blue"
            )}
            onClick={() => setActiveTab('api')}
          >
            <Key size={16} className="inline-block mr-1.5 -mt-0.5" />
            API Keys
          </button>
          <button
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 border-transparent",
              activeTab === 'webhooks' && "border-github-blue text-github-blue"
            )}
            onClick={() => setActiveTab('webhooks')}
          >
            <Webhook size={16} className="inline-block mr-1.5 -mt-0.5" />
            Webhooks
          </button>
          <button
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 border-transparent",
              activeTab === 'repositories' && "border-github-blue text-github-blue"
            )}
            onClick={() => setActiveTab('repositories')}
          >
            <Github size={16} className="inline-block mr-1.5 -mt-0.5" />
            Repositories
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'general' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">General Settings</h2>
              
              <div className="mb-6">
                <label htmlFor="appName" className="block text-sm font-medium text-github-gray-700 mb-1">
                  Application Name
                </label>
                <input
                  type="text"
                  id="appName"
                  className="block w-full border border-github-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-github-blue focus:border-github-blue"
                  defaultValue="PR Police"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="timezone" className="block text-sm font-medium text-github-gray-700 mb-1">
                  Default Timezone
                </label>
                <select
                  id="timezone"
                  className="block w-full border border-github-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-github-blue focus:border-github-blue"
                  defaultValue="UTC"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (US & Canada)</option>
                  <option value="America/Chicago">Central Time (US & Canada)</option>
                  <option value="America/Denver">Mountain Time (US & Canada)</option>
                  <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-github-gray-700 mb-1">
                  Notification Settings
                </label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      id="email-notifications"
                      type="checkbox"
                      className="h-4 w-4 text-github-blue border-github-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="email-notifications" className="ml-2 text-sm text-github-gray-700">
                      Email notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="browser-notifications"
                      type="checkbox"
                      className="h-4 w-4 text-github-blue border-github-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="browser-notifications" className="ml-2 text-sm text-github-gray-700">
                      Browser notifications
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'api' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">API Keys</h2>
              <p className="text-github-gray-600 mb-6">
                API keys are used to authenticate requests to the GitHub API. You can generate a new key from your GitHub account.
              </p>
              
              <div className="mb-6">
                <label htmlFor="githubToken" className="block text-sm font-medium text-github-gray-700 mb-1">
                  GitHub Personal Access Token
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex-grow focus-within:z-10">
                    <input
                      type={showApiKey ? "text" : "password"}
                      id="githubToken"
                      className="block w-full rounded-none rounded-l-md border border-github-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-github-blue focus:border-github-blue"
                      placeholder="ghp_1234567890abcdefghijk"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 flex items-center"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      <Lock size={16} className="text-github-gray-400" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="relative -ml-px inline-flex items-center rounded-r-md border border-github-gray-300 bg-github-gray-50 px-4 py-2 text-sm font-medium text-github-gray-700 hover:bg-github-gray-100"
                  >
                    Validate
                  </button>
                </div>
                <p className="mt-1 text-sm text-github-gray-500">
                  Your token needs <code>repo</code> and <code>workflow</code> scopes.
                </p>
              </div>
              
              <div>
                <h3 className="text-md font-semibold">Required Permissions</h3>
                <div className="mt-2 space-y-1 text-sm text-github-gray-600">
                  <div className="flex items-center">
                    <span className="w-20">repo</span>
                    <span>Full control of private repositories</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20">workflow</span>
                    <span>Update GitHub Action workflows</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'webhooks' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Webhook Configuration</h2>
              <p className="text-github-gray-600 mb-6">
                Configure webhooks to receive notifications when pull requests are opened, updated, or closed.
              </p>
              
              <div className="mb-6 bg-github-gray-50 border border-github-gray-200 rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Webhook URL</h3>
                  <button 
                    className="text-github-blue text-sm hover:underline"
                    onClick={() => copyToClipboard(webhookUrl)}
                  >
                    Copy
                  </button>
                </div>
                <div className="text-github-gray-800 font-mono text-sm p-2 bg-white border border-github-gray-200 rounded">
                  {webhookUrl}
                </div>
                <p className="mt-2 text-sm text-github-gray-600">
                  Add this URL to your GitHub repository webhooks settings.
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Events to Receive</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="event-pr"
                      type="checkbox"
                      className="h-4 w-4 text-github-blue border-github-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="event-pr" className="ml-2 text-sm text-github-gray-700">
                      Pull request (opened, synchronized, closed)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="event-pr-review"
                      type="checkbox"
                      className="h-4 w-4 text-github-blue border-github-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="event-pr-review" className="ml-2 text-sm text-github-gray-700">
                      Pull request review (submitted, edited, dismissed)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="event-push"
                      type="checkbox"
                      className="h-4 w-4 text-github-blue border-github-gray-300 rounded"
                    />
                    <label htmlFor="event-push" className="ml-2 text-sm text-github-gray-700">
                      Push (commits added to repository)
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Webhook Secret</h3>
                  <button className="text-github-blue text-sm hover:underline">
                    Generate New
                  </button>
                </div>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="password"
                    className="block w-full rounded-l-md border border-github-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-github-blue focus:border-github-blue"
                    placeholder="••••••••••••••••••••••"
                    readOnly
                    defaultValue="webhook_secret_example"
                  />
                  <button
                    type="button"
                    className="relative -ml-px inline-flex items-center rounded-r-md border border-github-gray-300 bg-github-gray-50 px-4 py-2 text-sm font-medium text-github-gray-700 hover:bg-github-gray-100"
                    onClick={() => copyToClipboard("webhook_secret_example")}
                  >
                    Copy
                  </button>
                </div>
                <p className="mt-1 text-sm text-github-gray-500">
                  Use this secret in your GitHub webhook settings to verify webhook payloads.
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'repositories' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Configured Repositories</h2>
                <button 
                  className="btn-primary"
                  onClick={() => setIsAddRepoOpen(true)}
                >
                  <Plus size={16} className="mr-1" />
                  Add Repository
                </button>
              </div>
              
              {repositories.length === 0 ? (
                <div className="bg-github-gray-50 p-6 border border-github-gray-200 rounded-md text-center">
                  <Server size={32} className="mx-auto text-github-gray-400 mb-3" />
                  <h3 className="font-medium text-github-gray-700">No repositories configured</h3>
                  <p className="text-github-gray-500 mt-1 mb-4">
                    Add a repository to start receiving code review notifications.
                  </p>
                  <button 
                    className="btn-primary"
                    onClick={() => setIsAddRepoOpen(true)}
                  >
                    <Plus size={16} className="mr-1" />
                    Add Repository
                  </button>
                </div>
              ) : (
                <div className="border border-github-gray-200 rounded-md divide-y divide-github-gray-200">
                  {repositories.map(repo => (
                    <div key={repo.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <Github size={18} className="text-github-gray-600 mr-3" />
                        <div>
                          <div className="font-medium flex items-center">
                            {repo.owner}/{repo.name}
                            <a
                              href={repo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-github-gray-400 hover:text-github-gray-600"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                          <div className="text-sm text-github-gray-500">
                            Added {formatDistanceToNow(new Date(repo.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-github-gray-500 hover:text-github-gray-700 hover:bg-github-gray-100 rounded-md">
                          <Settings size={16} />
                        </button>
                        <button 
                          className="p-2 text-github-red hover:text-github-red-dark hover:bg-github-gray-100 rounded-md"
                          onClick={() => removeRepository(repo.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AddRepositoryDialog
        isOpen={isAddRepoOpen}
        onClose={() => setIsAddRepoOpen(false)}
        onAdd={addRepository}
      />
    </div>
  );
};

export default Configuration;