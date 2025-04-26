import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Execution } from '../types';
import { cn } from '../utils/cn';

interface ExecutionCardProps {
  execution: Execution;
}

const ExecutionCard: React.FC<ExecutionCardProps> = ({ execution }) => {
  const getStatusIcon = () => {
    switch (execution.status) {
      case 'completed':
        return execution.success 
          ? <CheckCircle2 className="text-github-green" size={18} />
          : <XCircle className="text-github-red" size={18} />;
      case 'failed':
        return <XCircle className="text-github-red" size={18} />;
      case 'running':
        return (
          <div className="animate-pulse-slow">
            <Clock className="text-github-blue" size={18} />
          </div>
        );
      case 'pending':
        return <AlertCircle className="text-github-yellow" size={18} />;
      default:
        return <AlertCircle className="text-github-gray-400" size={18} />;
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
  
  const getBorderColor = () => {
    switch (execution.status) {
      case 'completed':
        return execution.success ? 'border-github-green-light' : 'border-github-red-light';
      case 'failed':
        return 'border-github-red-light';
      case 'running':
        return 'border-github-blue-light';
      case 'pending':
        return 'border-github-yellow-light';
      default:
        return 'border-github-gray-200';
    }
  };
  
  return (
    <Link
      to={`/execution/${execution.id}`}
      className={cn(
        "block card p-4 transition-all duration-200 hover:shadow-github-lg border-l-4",
        getBorderColor()
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-semibold text-github-gray-900">
            {execution.repository.owner}/{execution.repository.name}
          </div>
          <div className="text-github-gray-600 mt-1">
            #{execution.pullRequestNumber} {execution.pullRequestTitle}
          </div>
        </div>
        <div className="flex items-center">
          {getStatusIcon()}
        </div>
      </div>
      
      <div className="mt-3 flex justify-between items-center text-sm">
        <div className="flex items-center text-github-gray-600">
          <span className="mr-2">{getStatusText()}</span>
          <span className="text-github-gray-400">·</span>
          <span className="ml-2">
            {formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })}
          </span>
        </div>
        
        {execution.status === 'running' && (
          <div className="text-github-blue text-sm font-medium">View progress</div>
        )}
      </div>
    </Link>
  );
};

export default ExecutionCard;