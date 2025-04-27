import { Repository } from '@supabase/supabase-js';

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

export type GitHubPullRequest = {
  number: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
};