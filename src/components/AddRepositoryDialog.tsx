import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { cn } from '../utils/cn';

interface AddRepositoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (repository: { owner: string; name: string }) => void;
}

const AddRepositoryDialog: React.FC<AddRepositoryDialogProps> = ({ isOpen, onClose, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [owner, setOwner] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!owner || !name) {
      setError('Please fill in all fields');
      return;
    }

    onAdd({ owner, name });
    onClose();
    setOwner('');
    setName('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-github-lg w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-4 border-b border-github-gray-200">
          <h2 className="text-lg font-semibold">Add Repository</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-github-gray-100 rounded-full"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="owner" className="block text-sm font-medium text-github-gray-700 mb-1">
              Repository Owner
            </label>
            <input
              type="text"
              id="owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="block w-full border border-github-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-github-blue focus:border-github-blue"
              placeholder="e.g., octocat"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-github-gray-700 mb-1">
              Repository Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full border border-github-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-github-blue focus:border-github-blue"
              placeholder="e.g., hello-world"
            />
          </div>

          {error && (
            <div className="mb-4 text-github-red text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Add Repository
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRepositoryDialog;