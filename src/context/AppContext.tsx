import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Notification, Repository, Execution } from '../types';
import { mockUser, mockNotifications, mockRepositories, mockExecutions } from '../data/mock';

interface AppContextType {
  user: User | null;
  notifications: Notification[];
  repositories: Repository[];
  executions: Execution[];
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  getExecution: (id: string) => Execution | undefined;
}

const AppContext = createContext<AppContextType>({
  user: null,
  notifications: [],
  repositories: [],
  executions: [],
  sidebarOpen: true,
  toggleSidebar: () => {},
  markNotificationAsRead: () => {},
  markAllNotificationsAsRead: () => {},
  getExecution: () => undefined,
});

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [repositories, setRepositories] = useState<Repository[]>(mockRepositories);
  const [executions, setExecutions] = useState<Execution[]>(mockExecutions);
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

  useEffect(() => {
    // This would be where you'd fetch initial data from API
  }, []);

  return (
    <AppContext.Provider 
      value={{ 
        user, 
        notifications, 
        repositories, 
        executions, 
        sidebarOpen,
        toggleSidebar,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        getExecution
      }}
    >
      {children}
    </AppContext.Provider>
  );
};