import React, { useState, useEffect } from 'react';
import {
    UserGroupIcon,
    BuildingStorefrontIcon,
    StarIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-toastify';
import AddStore from '../store/AddStore';
import AddUser from './AddUser';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0
    });
    const [recentRatings, setRecentRatings] = useState([]);
    const [topStores, setTopStores] = useState([]);
    const [showAddStore, setShowAddStore] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/users/dashboard-stats');
            const data = response.data;
            
            setStats(data.stats);
            setRecentRatings(data.recentRatings);
            setTopStores(data.topRatedStores);
        } catch (error) {
            toast.error('Failed to fetch dashboard data');
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage users, stores, and monitor platform activity</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <UserGroupIcon className="h-12 w-12 text-blue-600" />
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
                            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <BuildingStorefrontIcon className="h-12 w-12 text-green-600" />
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">Total Stores</h3>
                            <p className="text-3xl font-bold text-green-600">{stats.totalStores}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <StarIcon className="h-12 w-12 text-yellow-500" />
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">Total Ratings</h3>
                            <p className="text-3xl font-bold text-yellow-500">{stats.totalRatings}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
                <button
                    onClick={() => setShowAddStore(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Store
                </button>
                <button
                    onClick={() => setShowAddUser(true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add User
                </button>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Ratings */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Ratings</h3>
                    {recentRatings.length > 0 ? (
                        <div className="space-y-4">
                            {recentRatings.map((rating, index) => (
                                <div key={index} className="flex items-center justify-between border-b pb-2">
                                    <div>
                                        <p className="font-medium text-gray-900">{rating.user_name}</p>
                                        <p className="text-sm text-gray-600">{rating.store_name}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    className={`h-4 w-4 ${
                                                        i < rating.rating ? 'text-yellow-400' : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="ml-2 text-sm text-gray-600">
                                            {new Date(rating.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No recent ratings</p>
                    )}
                </div>

                {/* Top Rated Stores */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Rated Stores</h3>
                    {topStores.length > 0 ? (
                        <div className="space-y-4">
                            {topStores.map((store, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{store.name}</p>
                                        <p className="text-sm text-gray-600">{store.total_ratings} ratings</p>
                                    </div>
                                    <div className="flex items-center">
                                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                                        <span className="font-semibold">{store.average_rating}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No rated stores yet</p>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showAddStore && (
                <AddStore
                    onClose={() => setShowAddStore(false)}
                    onSuccess={() => {
                        setShowAddStore(false);
                        fetchDashboardData();
                    }}
                />
            )}

            {showAddUser && (
                <AddUser
                    onClose={() => setShowAddUser(false)}
                    onSuccess={() => {
                        setShowAddUser(false);
                        fetchDashboardData();
                    }}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
