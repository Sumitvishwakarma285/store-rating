import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { EyeIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const StoreCard = ({ store, onRatingUpdate, onViewRatings }) => {
    const { user } = useAuth();
    const [selectedRating, setSelectedRating] = useState(store.user_rating || 0);
    const [loading, setLoading] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);

    const submitRating = async (rating) => {
        if (user.role !== 'normal') {
            toast.error('Only normal users can submit ratings');
            return;
        }

        setLoading(true);
        try {
            await axios.post('/api/ratings', {
                storeId: store.id,
                rating: rating
            });
            
            setSelectedRating(rating);
            toast.success('Rating submitted successfully!');
            if (onRatingUpdate) onRatingUpdate();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit rating');
        }
        setLoading(false);
    };

    const renderStars = (count, interactive = false) => {
        return [...Array(5)].map((_, index) => {
            const isFilled = index < count;
            const StarComponent = isFilled ? StarIcon : StarOutline;
            
            return (
                <StarComponent
                    key={index}
                    className={`w-5 h-5 ${
                        interactive 
                            ? 'cursor-pointer hover:text-yellow-400 transition-colors' 
                            : ''
                    } ${isFilled ? 'text-yellow-400' : 'text-gray-300'}`}
                    onClick={interactive ? () => submitRating(index + 1) : undefined}
                    onMouseEnter={interactive ? () => setHoveredRating(index + 1) : undefined}
                    onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
                />
            );
        });
    };

    const renderInteractiveStars = () => {
        return [...Array(5)].map((_, index) => {
            const isFilled = index < (hoveredRating || selectedRating);
            const StarComponent = isFilled ? StarIcon : StarOutline;
            
            return (
                <StarComponent
                    key={index}
                    className={`w-5 h-5 cursor-pointer transition-colors ${
                        isFilled ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400`}
                    onClick={() => submitRating(index + 1)}
                    onMouseEnter={() => setHoveredRating(index + 1)}
                    onMouseLeave={() => setHoveredRating(0)}
                />
            );
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{store.name}</h3>
                    <p className="text-gray-600 mb-2">{store.email}</p>
                    <p className="text-gray-600 mb-4">{store.address}</p>
                </div>
                {onViewRatings && (
                    <button
                        onClick={() => onViewRatings(store)}
                        className="flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View Ratings
                    </button>
                )}
            </div>
            
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Overall Rating</p>
                    <div className="flex items-center">
                        {renderStars(Math.round(parseFloat(store.average_rating)))}
                        <span className="ml-2 text-sm text-gray-600">
                            ({parseFloat(store.average_rating).toFixed(1)}) • {store.total_ratings} reviews
                        </span>
                    </div>
                </div>
                
                {selectedRating > 0 && (
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Your Rating</p>
                        <div className="flex items-center">
                            {renderStars(selectedRating)}
                        </div>
                    </div>
                )}
            </div>
            
            {user?.role === 'normal' && (
                <div>
                    <p className="text-sm text-gray-500 mb-2">
                        {selectedRating > 0 ? 'Update your rating:' : 'Rate this store:'}
                    </p>
                    <div className="flex items-center space-x-1">
                        {renderInteractiveStars()}
                        {loading && (
                            <div className="ml-2 flex items-center">
                                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                <span className="ml-1 text-sm text-gray-500">Submitting...</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreCard;
