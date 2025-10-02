import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-8 w-8',
        large: 'h-12 w-12'
    };

    const containerClasses = {
        small: 'p-2',
        medium: 'p-4',
        large: 'p-8'
    };

    return (
        <div className={`flex flex-col items-center justify-center ${containerClasses[size]}`}>
            <div
                className={`${sizeClasses[size]} border-4 border-gray-200 border-t-4 border-t-blue-600 rounded-full animate-spin`}
            ></div>
            {text && (
                <p className="mt-2 text-sm text-gray-600">{text}</p>
            )}
        </div>
    );
};

export default LoadingSpinner;
