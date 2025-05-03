import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  GitPullRequest, 
  History, 
  Plus, 
  BookOpen,
  Shield,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar: React.FC = () => {
  const { sidebarOpen } = useApp();
  
  return (
    <aside 
      className={`
        fixed top-16 left-0 bottom-0 z-40 bg-white border-r border-github-gray-200
        transition-all duration-200 overflow-y-auto
        ${sidebarOpen ? 'w-[250px]' : 'w-[60px]'}
      `}
    >
      <div className="p-4">
        <NavLink
          to="/"
          className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''} ${!sidebarOpen && 'justify-center'}`
          }
        >
          <Home size={18} className="mr-2 flex-shrink-0" />
          {sidebarOpen && <span>Dashboard</span>}
        </NavLink>
        
        <NavLink
          to="/pull-requests"
          className={({ isActive }) => 
            `nav-item mt-2 ${isActive ? 'active' : ''} ${!sidebarOpen && 'justify-center'}`
          }
        >
          <GitPullRequest size={18} className="mr-2 flex-shrink-0" />
          {sidebarOpen && <span>Pull Requests</span>}
        </NavLink>
        
        <NavLink
          to="/history"
          className={({ isActive }) => 
            `nav-item mt-2 ${isActive ? 'active' : ''} ${!sidebarOpen && 'justify-center'}`
          }
        >
          <History size={18} className="mr-2 flex-shrink-0" />
          {sidebarOpen && <span>History</span>}
        </NavLink>
        
        <NavLink
          to="/configuration"
          className={({ isActive }) => 
            `nav-item mt-2 ${isActive ? 'active' : ''} ${!sidebarOpen && 'justify-center'}`
          }
        >
          <Settings size={18} className="mr-2 flex-shrink-0" />
          {sidebarOpen && <span>Settings</span>}
        </NavLink>
        
        {sidebarOpen && (
          <>
            <div className="mt-8 mb-3 px-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold text-github-gray-500 uppercase tracking-wider">Repositories</h3>
                <button className="p-1 text-github-gray-500 hover:text-github-gray-900 hover:bg-github-gray-100 rounded-md">
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            <div className="px-3 py-2">
              <div className="text-sm text-github-gray-600">
                No repositories configured
              </div>
            </div>
          </>
        )}
      </div>
      
      {sidebarOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-github-gray-200 bg-github-gray-50">
          <div className="flex items-center text-sm text-github-gray-600">
            <Shield size={18} className="mr-2 text-github-gray-500" />
            <span className="truncate">PR Police v0.1.0</span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;