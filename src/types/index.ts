export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
  type: 'success' | 'error' | 'info' | 'warning';
};

export type Repository = {
  id: string;
  name: string;
  owner: string;
  url: string;
  createdAt: string;
};

export type ExecutionStatus = 'running' | 'completed' | 'failed' | 'pending';

export type Execution = {
  id: string;
  repositoryId: string;
  repository: Repository;
  pullRequestNumber: number;
  pullRequestTitle: string;
  status: ExecutionStatus;
  startedAt: string;
  completedAt?: string;
  logs: string[];
  success?: boolean;
};