import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/common/Header';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/dashboard/AdminDashboard';
import UserDashboard from './components/dashboard/UserDashboard';
import StoreOwnerDashboard from './components/dashboard/StoreOwnerDashboard';
import StoreList from './components/store/StoreList';
import LoadingSpinner from './components/common/LoadingSpinner';
import UsersPage from './pages/UsersPage';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const AppContent = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="large" text="Loading Store Rating Platform..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {user && <Header />}
            
            <main className={user ? 'pt-0' : ''}>
                <Routes>
                    {/* Public Routes */}
                    <Route 
                        path="/login" 
                        element={user ? <Navigate to="/dashboard" /> : <Login />} 
                    />
                    <Route 
                        path="/register" 
                        element={user ? <Navigate to="/dashboard" /> : <Register />} 
                    />

                    {/* Dashboard - Role-based routing */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardRouter />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <UsersPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Store Owner Routes */}
                    <Route
                        path="/store-dashboard"
                        element={
                            <ProtectedRoute requiredRole="store_owner">
                                <StoreOwnerDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Common Routes for All Authenticated Users */}
                    <Route
                        path="/stores"
                        element={
                            <ProtectedRoute>
                                <div className="max-w-7xl mx-auto p-6">
                                    <StoreList showActions={user?.role === 'admin'} />
                                </div>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Normal User Specific Routes */}
                    <Route
                        path="/my-ratings"
                        element={
                            <ProtectedRoute requiredRole="normal">
                                <MyRatingsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Unauthorized Route */}
                    <Route
                        path="/unauthorized"
                        element={<UnauthorizedPage />}
                    />

                    {/* Default Route */}
                    <Route 
                        path="/" 
                        element={
                            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
                        } 
                    />

                    {/* Catch All - 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                className="z-50"
                theme="light"
            />
        </div>
    );
};

// Role-based Dashboard Router Component
const DashboardRouter = () => {
    const { user } = useAuth();

    console.log(`Rendering dashboard for user role: ${user?.role}`);

    switch (user?.role) {
        case 'admin':
            return <AdminDashboard />;
        case 'store_owner':
            return <StoreOwnerDashboard />;
        case 'normal':
            return <UserDashboard />;
        default:
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Invalid User Role
                        </h2>
                        <p className="text-gray-600">
                            Your account role is not recognized. Please contact support.
                        </p>
                    </div>
                </div>
            );
    }
};

// Profile Page Component (Inline)
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

// My Ratings Page Component (Inline)
const MyRatingsPage = () => {
    const { user } = useAuth();
    
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

// Unauthorized Access Component
const UnauthorizedPage = () => {
    const { user } = useAuth();
    
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
                <div className="mb-6">
                    <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Access Denied
                </h2>
                <p className="text-gray-600 mb-6">
                    You don't have permission to access this page. Your current role is: <strong>{user?.role}</strong>
                </p>
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

// 404 Not Found Component
const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
                <div className="mb-6">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-600 mb-6">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="space-x-4">
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;
