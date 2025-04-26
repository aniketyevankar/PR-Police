import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Github as GitHub, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../utils/cn';

const Header: React.FC = () => {
  const { user, notifications, toggleSidebar, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };
  
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (profileOpen) setProfileOpen(false);
  };

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markNotificationAsRead(id);
  };

  return (
    <header className="bg-github-gray-900 text-white h-16 flex items-center sticky top-0 z-50 px-4">
      <div className="flex-1 flex items-center h-full">
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-full hover:bg-github-gray-700"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        
        <Link to="/" className="ml-4 flex items-center">
          <GitHub size={24} className="mr-2" />
          <span className="font-semibold text-lg hidden md:block">Code Review</span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative">
          <button 
            onClick={toggleNotifications}
            className="p-2 rounded-full hover:bg-github-gray-700 relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-github-blue text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-github-lg text-github-gray-900 z-50">
              <div className="p-3 border-b border-github-gray-200 flex justify-between items-center">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllNotificationsAsRead}
                    className="text-github-blue text-xs hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              <div className="max-h-96 overflow-auto divide-y divide-github-gray-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-github-gray-500">
                    No notifications
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={cn(
                        "p-3 hover:bg-github-gray-50 cursor-pointer flex", 
                        !notification.read && "bg-github-blue/5"
                      )}
                    >
                      <div className="flex-1 pr-2">
                        <div className="font-medium text-sm">{notification.title}</div>
                        <div className="text-github-gray-600 text-xs">{notification.description}</div>
                        <div className="text-github-gray-500 text-xs mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      {!notification.read && (
                        <button 
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          className="p-1 hover:bg-github-gray-200 rounded-full"
                          aria-label="Mark as read"
                        >
                          <Check size={14} className="text-github-gray-500" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button 
            onClick={toggleProfile}
            className="flex items-center space-x-2 hover:bg-github-gray-700 rounded-full"
            aria-label="Profile"
          >
            <img 
              src={user?.avatarUrl} 
              alt={user?.name} 
              className="w-8 h-8 rounded-full"
            />
          </button>
          
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-github-lg text-github-gray-900 z-50">
              <div className="p-3 border-b border-github-gray-200">
                <div className="font-semibold">{user?.name}</div>
                <div className="text-github-gray-600 text-sm">{user?.email}</div>
              </div>
              
              <div className="py-1">
                <Link
                  to="/profile"
                  className="px-4 py-2 hover:bg-github-gray-50 text-sm block"
                  onClick={() => setProfileOpen(false)}
                >
                  Your profile
                </Link>
                <Link
                  to="/configuration"
                  className="px-4 py-2 hover:bg-github-gray-50 text-sm block"
                  onClick={() => setProfileOpen(false)}
                >
                  Settings
                </Link>
                <div className="border-t border-github-gray-200 mt-1"></div>
                <button className="px-4 py-2 hover:bg-github-gray-50 text-sm block w-full text-left text-github-red">
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;