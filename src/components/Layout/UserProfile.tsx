import { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t px-4 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-100"
      >
        <UserIcon className="h-6 w-6 text-gray-600" />
        <span className="ml-3 text-gray-600">User Profile</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 left-4 w-56 bg-white rounded-lg shadow-lg p-4">
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
              Change Password
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
              Delete Account
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-red-600">
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 