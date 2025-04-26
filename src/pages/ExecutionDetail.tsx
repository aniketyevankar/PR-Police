import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  GitPullRequest, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock,
  GitBranch,
  Terminal
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useApp } from '../context/AppContext';

const ExecutionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getExecution } = useApp();
  const execution = getExecution(id || '');
  const logsEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [execution?.logs]);
  
  if (!execution) {
    return (
      <div className="text-center py-10">
        <AlertCircle size={48} className="mx-auto text-github-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-github-gray-700">Execution not found</h2>
        <p className="text-github-gray-500 mt-1">
          The execution you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="btn-primary mt-4 inline-flex">
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  const getStatusIcon = () => {
    switch (execution.status) {
      case 'completed':
        return execution.success 
          ? <CheckCircle2 className="text-github-green" size={20} />
          : <XCircle className="text-github-red" size={20} />;
      case 'failed':
        return <XCircle className="text-github-red" size={20} />;
      case 'running':
        return (
          <div className="animate-pulse-slow">
            <Clock className="text-github-blue" size={20} />
          </div>
        );
      case 'pending':
        return <AlertCircle className="text-github-yellow" size={20} />;
      default:
        return <AlertCircle className="text-github-gray-400" size={20} />;
    }
  };
  
  const getStatusText = () => {
    switch (execution.status) {
      case 'completed':
        return execution.success ? 'Completed successfully' : 'Completed with issues';
      case 'failed':
        return 'Failed';
      case 'running':
        return 'Running';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };
  
  const getStatusClass = () => {
    switch (execution.status) {
      case 'completed':
        return execution.success ? 'text-github-green' : 'text-github-red';
      case 'failed':
        return 'text-github-red';
      case 'running':
        return 'text-github-blue';
      case 'pending':
        return 'text-github-yellow';
      default:
        return 'text-github-gray-400';
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="text-github-gray-600 hover:text-github-gray-900 flex items-center">
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center">
              <GitPullRequest size={20} className="mr-2 text-github-gray-600" />
              <span>
                {execution.repository.owner}/{execution.repository.name} #{execution.pullRequestNumber}
              </span>
            </h1>
            <h2 className="text-lg text-github-gray-600 mt-1">{execution.pullRequestTitle}</h2>
          </div>
          
          <div className="mt-3 md:mt-0 flex items-center">
            {getStatusIcon()}
            <span className={`ml-2 font-medium ${getStatusClass()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
        
        <div className="border-t border-github-gray-200 pt-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-github-gray-500">Started</div>
              <div className="font-medium">
                {format(new Date(execution.startedAt), 'MMM d, yyyy h:mm a')}
                <span className="text-github-gray-500 text-sm ml-2">
                  ({formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })})
                </span>
              </div>
            </div>
            
            {execution.completedAt && (
              <div>
                <div className="text-sm text-github-gray-500">Completed</div>
                <div className="font-medium">
                  {format(new Date(execution.completedAt), 'MMM d, yyyy h:mm a')}
                  <span className="text-github-gray-500 text-sm ml-2">
                    ({formatDistanceToNow(new Date(execution.completedAt), { addSuffix: true })})
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <div className="text-sm text-github-gray-500">Repository</div>
            <div className="font-medium flex items-center">
              <GitBranch size={16} className="mr-2 text-github-gray-600" />
              <a 
                href={execution.repository.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-github-blue hover:underline"
              >
                {execution.repository.owner}/{execution.repository.name}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="border-b border-github-gray-200 p-4 flex items-center">
          <Terminal size={18} className="mr-2 text-github-gray-600" />
          <h3 className="font-semibold">Execution Logs</h3>
        </div>
        
        <div className="bg-github-gray-900 text-white p-4 rounded-b-md overflow-auto max-h-[500px] font-mono text-sm">
          {execution.logs.map((log, index) => (
            <div key={index} className="py-1">
              <span className="text-github-gray-400 mr-2">[{index + 1}]</span>
              {log}
            </div>
          ))}
          {execution.status === 'running' && (
            <div className="h-4 w-4 mt-2 relative">
              <div className="animate-pulse bg-github-gray-400 h-2 w-2 rounded-full absolute"></div>
            </div>
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ExecutionDetail;