import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StoreList from '../store/StoreList';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserDashboard = () => {
    const { user } = useAuth();
    const [userRatings, setUserRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserRatings();
    }, []);

    const fetchUserRatings = async () => {
        try {
            const response = await axios.get('/api/ratings/user');
            setUserRatings(response.data.ratings);
        } catch (error) {
            toast.error('Failed to fetch your ratings');
        }
        setLoading(false);
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
                <p className="text-gray-600">Rate stores and share your experiences</p>
            </div>

            {/* User Stats */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">{userRatings.length}</p>
                        <p className="text-gray-600">Stores Rated</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">
                            {userRatings.length > 0 
                                ? (userRatings.reduce((sum, rating) => sum + rating.rating, 0) / userRatings.length).toFixed(1)
                                : '0.0'
                            }
                        </p>
                        <p className="text-gray-600">Average Rating Given</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600">
                            {new Date(user?.created_at).toLocaleDateString() || 'N/A'}
                        </p>
                        <p className="text-gray-600">Member Since</p>
                    </div>
                </div>
            </div>

            {/* Recent Ratings */}
            {userRatings.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Recent Ratings</h2>
                    <div className="space-y-4">
                        {userRatings.slice(0, 5).map((rating, index) => (
                            <div key={index} className="flex items-center justify-between border-b pb-2">
                                <div>
                                    <p className="font-medium text-gray-900">{rating.store_name}</p>
                                    <p className="text-sm text-gray-600">{rating.store_address}</p>
                                </div>
                                <div className="flex items-center">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <span
                                                key={i}
                                                className={`text-lg ${
                                                    i < rating.rating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-600">
                                        {new Date(rating.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Store List */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">All Stores</h2>
                    <p className="text-gray-600">Browse and rate stores</p>
                </div>
                <StoreList />
            </div>
        </div>
    );
};

export default UserDashboard;
