import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-toastify';
import StoreCard from './StoreCard';
import LoadingSpinner from '../common/LoadingSpinner';

const StoreList = ({ showActions = false }) => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('ASC');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchStores();
    }, [searchTerm, sortBy, sortOrder, currentPage]);

    const fetchStores = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/stores', {
                params: {
                    search: searchTerm,
                    sortBy,
                    sortOrder,
                    page: currentPage,
                    limit: 6
                }
            });

            setStores(response.data.stores || []);
            setTotalPages(response.data.pagination?.total_pages || 1);
        } catch (error) {
            toast.error('Failed to fetch stores');
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
        } else {
            setSortBy(field);
            setSortOrder('ASC');
        }
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading && stores.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="p-6">
            {/* Search and Filter Controls */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search stores by name or address..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        <FunnelIcon className="h-5 w-5 mr-2" />
                        Filters
                    </button>
                </div>

                {/* Sort Controls */}
                {showFilters && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Sort by:</h3>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: 'name', label: 'Name' },
                                { value: 'average_rating', label: 'Rating' },
                                { value: 'total_ratings', label: 'Number of Reviews' },
                                { value: 'created_at', label: 'Date Added' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSort(option.value)}
                                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                        sortBy === option.value
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {option.label}
                                    {sortBy === option.value && (
                                        <span className="ml-1">
                                            {sortOrder === 'ASC' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Results Info */}
            <div className="mb-4 text-sm text-gray-600">
                Showing {stores.length} stores
                {searchTerm && (
                    <span> for "{searchTerm}"</span>
                )}
            </div>

            {/* Store Grid */}
            {stores.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {stores.map((store) => (
                            <StoreCard
                                key={store.id}
                                store={store}
                                onRatingUpdate={fetchStores}
                                showActions={showActions}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            {[...Array(totalPages)].map((_, i) => {
                                const page = i + 1;
                                const isCurrentPage = page === currentPage;
                                const shouldShow = 
                                    page === 1 || 
                                    page === totalPages || 
                                    (page >= currentPage - 1 && page <= currentPage + 1);

                                if (!shouldShow) {
                                    return i === 1 || i === totalPages - 2 ? (
                                        <span key={page} className="px-2 text-gray-500">...</span>
                                    ) : null;
                                }

                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-2 text-sm rounded-lg ${
                                            isCurrentPage
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white border border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        {searchTerm ? 'No stores found matching your search.' : 'No stores available.'}
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setCurrentPage(1);
                            }}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            )}

            {loading && stores.length > 0 && (
                <div className="flex justify-center mt-4">
                    <LoadingSpinner />
                </div>
            )}
        </div>
    );
};

export default StoreList;
