import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StarIcon, EyeIcon } from '@heroicons/react/24/outline';

const StoreOwnerDashboard = () => {
    const { user } = useAuth();
    const [ownedStores, setOwnedStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [storeRatings, setStoreRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOwnedStores();
    }, []);

    const fetchOwnedStores = async () => {
        try {
            const response = await axios.get('/api/stores', {
                params: { ownerId: user.id }
            });
            setOwnedStores(response.data.stores || []);
        } catch (error) {
            toast.error('Failed to fetch owned stores');
        }
        setLoading(false);
    };

    const fetchStoreRatings = async (storeId) => {
        try {
            const response = await axios.get(`/api/ratings/store/${storeId}`);
            setStoreRatings(response.data.ratings);
            setSelectedStore(storeId);
        } catch (error) {
            toast.error('Failed to fetch store ratings');
        }
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
                <h1 className="text-3xl font-bold text-gray-900">Store Owner Dashboard</h1>
                <p className="text-gray-600">Manage your stores and monitor ratings</p>
            </div>

            {ownedStores.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <p className="text-gray-600 text-lg">You don't own any stores yet.</p>
                    <p className="text-gray-500 mt-2">Contact an administrator to assign stores to your account.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Owned Stores */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Stores</h2>
                        <div className="space-y-4">
                            {ownedStores.map((store) => (
                                <div key={store.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{store.name}</h3>
                                            <p className="text-sm text-gray-600">{store.address}</p>
                                            <div className="flex items-center mt-2">
                                                <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                                                <span className="text-sm font-medium">
                                                    {store.average_rating} ({store.total_ratings} ratings)
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => fetchStoreRatings(store.id)}
                                            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            <EyeIcon className="h-4 w-4 mr-1" />
                                            View Ratings
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Store Ratings */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Store Ratings</h2>
                        {selectedStore ? (
                            <div>
                                {storeRatings.length > 0 ? (
                                    <div className="space-y-4">
                                        {storeRatings.map((rating, index) => (
                                            <div key={index} className="border-b pb-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{rating.name}</p>
                                                        <p className="text-sm text-gray-600">{rating.email}</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <StarIcon
                                                                key={i}
                                                                className={`h-4 w-4 ${
                                                                    i < rating.rating ? 'text-yellow-400' : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {new Date(rating.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No ratings for this store yet.</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500">Select a store to view its ratings.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreOwnerDashboard;
