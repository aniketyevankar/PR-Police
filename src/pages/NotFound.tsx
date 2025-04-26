import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle size={64} className="text-github-gray-300 mb-6" />
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-xl mb-6">Page not found</h2>
      <p className="text-github-gray-600 max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">
        <Home size={16} className="mr-2" />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;