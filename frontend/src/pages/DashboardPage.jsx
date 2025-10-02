import React from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">This is your dashboard</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900">Your Role</h3>
            <p className="text-2xl font-bold text-blue-600 capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-900">Account Status</h3>
            <p className="text-2xl font-bold text-green-600">Active</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-900">Member Since</h3>
            <p className="text-lg font-bold text-purple-600">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
