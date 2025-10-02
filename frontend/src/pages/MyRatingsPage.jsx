import React from 'react';

const MyRatingsPage = () => {
    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Ratings</h1>
                <p className="text-gray-600 mt-2">View and manage all your store ratings</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center py-12">
                    <div className="mx-auto h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">⭐</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Ratings Yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                        You haven't rated any stores yet. Start exploring and rating stores!
                    </p>
                    <button
                        onClick={() => window.location.href = '/stores'}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Browse Stores
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyRatingsPage;
