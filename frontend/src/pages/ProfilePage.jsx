import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
    const { user } = useAuth();
    
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <div className="p-3 bg-gray-50 rounded-md">{user?.name}</div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <div className="p-3 bg-gray-50 rounded-md">{user?.email}</div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <div className="p-3 bg-gray-50 rounded-md capitalize">
                            {user?.role?.replace('_', ' ')}
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                        <div className="p-3 bg-gray-50 rounded-md">
                            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>
                </div>

                {user?.address && (
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <div className="p-3 bg-gray-50 rounded-md">{user.address}</div>
                    </div>
                )}
                
                <div className="mt-6 text-center">
                    <p className="text-gray-600">Profile editing feature coming soon!</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
