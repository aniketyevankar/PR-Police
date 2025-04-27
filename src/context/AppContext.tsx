import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Notification, Repository, Execution, GitHubPullRequest } from '../types';
import { mockUser, mockNotifications } from '../data/mock';

interface AppContextType {
  user: User | null;
  notifications: Notification[];
  repositories: Repository[];
  executions: Execution[];
  pullRequests: Record<string, GitHubPullRequest[]>;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  getExecution: (id: string) => Execution | undefined;
  addRepository: (repository: { owner: string; name: string }) => Promise<void>;
  removeRepository: (id: string) => void;
  fetchPullRequests: (repository: Repository) => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  user: null,
  notifications: [],
  repositories: [],
  executions: [],
  pullRequests: {},
  sidebarOpen: true,
  toggleSidebar: () => {},
  markNotificationAsRead: () => {},
  markAllNotificationsAsRead: () => {},
  getExecution: () => undefined,
  addRepository: async () => {},
  removeRepository: () => {},
  fetchPullRequests: async () => {},
});

export const useApp = () => useContext(AppContext);

const defaultRepository: Repository = {
  id: crypto.randomUUID(),
  name: 'PR-Police',
  owner: 'aniketyevankar',
  url: 'https://github.com/aniketyevankar/PR-Police',
  createdAt: new Date().toISOString(),
};

const POLL_INTERVAL = 30000; // Poll every 30 seconds

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [repositories, setRepositories] = useState<Repository[]>([defaultRepository]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [pullRequests, setPullRequests] = useState<Record<string, GitHubPullRequest[]>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getExecution = (id: string) => {
    return executions.find(execution => execution.id === id);
  };

  const fetchPullRequests = useCallback(async (repository: Repository) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${repository.owner}/${repository.name}/pulls`);
      if (!response.ok) throw new Error('Failed to fetch pull requests');
      const data = await response.json();
      setPullRequests(prev => ({
        ...prev,
        [`${repository.owner}/${repository.name}`]: data
      }));

      // Add notification for new PRs
      const currentPRs = pullRequests[`${repository.owner}/${repository.name}`] || [];
      const newPRs = data.filter(newPR => 
        !currentPRs.some(currentPR => currentPR.number === newPR.number)
      );

      if (newPRs.length > 0) {
        newPRs.forEach(pr => {
          const notification: Notification = {
            id: crypto.randomUUID(),
            title: 'New Pull Request',
            description: `#${pr.number} ${pr.title} in ${repository.owner}/${repository.name}`,
            read: false,
            createdAt: new Date().toISOString(),
            type: 'info'
          };
          setNotifications(prev => [notification, ...prev]);
        });
      }
    } catch (error) {
      console.error('Error fetching pull requests:', error);
    }
  }, [pullRequests]);

  const addRepository = async (repository: { owner: string; name: string }) => {
    const newRepository: Repository = {
      id: crypto.randomUUID(),
      name: repository.name,
      owner: repository.owner,
      url: `https://github.com/${repository.owner}/${repository.name}`,
      createdAt: new Date().toISOString(),
    };
    setRepositories(prev => [...prev, newRepository]);
    await fetchPullRequests(newRepository);
  };

  const removeRepository = (id: string) => {
    const repository = repositories.find(repo => repo.id === id);
    if (repository) {
      const key = `${repository.owner}/${repository.name}`;
      setPullRequests(prev => {
        const newPullRequests = { ...prev };
        delete newPullRequests[key];
        return newPullRequests;
      });
    }
    setRepositories(prev => prev.filter(repo => repo.id !== id));
  };

  // Initial fetch of pull requests
  useEffect(() => {
    repositories.forEach(fetchPullRequests);
  }, []);

  // Set up polling for pull requests
  useEffect(() => {
    const pollTimer = setInterval(() => {
      repositories.forEach(fetchPullRequests);
    }, POLL_INTERVAL);

    return () => clearInterval(pollTimer);
  }, [repositories, fetchPullRequests]);

  return (
    <AppContext.Provider 
      value={{ 
        user, 
        notifications, 
        repositories, 
        executions,
        pullRequests,
        sidebarOpen,
        toggleSidebar,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        getExecution,
        addRepository,
        removeRepository,
        fetchPullRequests
      }}
    >
      {children}
    </AppContext.Provider>
  );
};