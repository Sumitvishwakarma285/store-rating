export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const USER_ROLES = {
    ADMIN: 'admin',
    NORMAL: 'normal',
    STORE_OWNER: 'store_owner'
};

export const RATING_OPTIONS = [
    { value: 1, label: '1 Star - Poor' },
    { value: 2, label: '2 Stars - Fair' },
    { value: 3, label: '3 Stars - Good' },
    { value: 4, label: '4 Stars - Very Good' },
    { value: 5, label: '5 Stars - Excellent' }
];

export const SORT_OPTIONS = [
    { value: 'name', label: 'Name' },
    { value: 'average_rating', label: 'Rating' },
    { value: 'total_ratings', label: 'Number of Reviews' },
    { value: 'created_at', label: 'Date Added' }
];

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 6,
    MAX_PAGE_SIZE: 50
};
