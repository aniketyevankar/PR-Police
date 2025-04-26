import { User, Notification, Repository, Execution } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
};

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Code Review Completed',
    description: 'Your code review for PR #123 has been completed.',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    type: 'success',
  },
  {
    id: '2',
    title: 'Code Review Failed',
    description: 'Code review for PR #121 failed due to an error.',
    read: false,
    createdAt: new Date(Date.now() - 36000000).toISOString(),
    type: 'error',
  },
  {
    id: '3',
    title: 'New Pull Request',
    description: 'A new pull request #124 was opened in your repository.',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    type: 'info',
  },
];

export const mockRepositories: Repository[] = [
  {
    id: '1',
    name: 'awesome-app',
    owner: 'johndoe',
    url: 'https://github.com/johndoe/awesome-app',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: '2',
    name: 'cool-website',
    owner: 'johndoe',
    url: 'https://github.com/johndoe/cool-website',
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
];

export const mockExecutions: Execution[] = [
  {
    id: '1',
    repositoryId: '1',
    repository: mockRepositories[0],
    pullRequestNumber: 123,
    pullRequestTitle: 'Fix authentication logic',
    status: 'running',
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    logs: [
      'Initializing code review...',
      'Cloning repository...',
      'Checking out PR branch...',
      'Analyzing code changes...',
    ],
  },
  {
    id: '2',
    repositoryId: '1',
    repository: mockRepositories[0],
    pullRequestNumber: 122,
    pullRequestTitle: 'Add new feature',
    status: 'completed',
    startedAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86397000).toISOString(),
    logs: [
      'Initializing code review...',
      'Cloning repository...',
      'Checking out PR branch...',
      'Analyzing code changes...',
      'Performing static analysis...',
      'Review completed successfully.',
    ],
    success: true,
  },
  {
    id: '3',
    repositoryId: '2',
    repository: mockRepositories[1],
    pullRequestNumber: 45,
    pullRequestTitle: 'Update dependencies',
    status: 'failed',
    startedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 2 + 3000000).toISOString(),
    logs: [
      'Initializing code review...',
      'Cloning repository...',
      'Checking out PR branch...',
      'Error: Unable to analyze code changes.',
    ],
    success: false,
  },
  {
    id: '4',
    repositoryId: '2',
    repository: mockRepositories[1],
    pullRequestNumber: 44,
    pullRequestTitle: 'Refactor API endpoints',
    status: 'completed',
    startedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 3 + 3000000).toISOString(),
    logs: [
      'Initializing code review...',
      'Cloning repository...',
      'Checking out PR branch...',
      'Analyzing code changes...',
      'Performing static analysis...',
      'Review completed successfully.',
    ],
    success: true,
  },
];