import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const password = watch('password');

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Register as normal user (role handled by backend)
            const user = await registerUser({
                name: data.name,
                email: data.email,
                password: data.password,
                address: data.address
            });

            toast.success(`Welcome to Store Rating Platform, ${user?.name || 'User'}!`);
            navigate('/dashboard');
        } catch (error) {
            toast.error(
                error.response?.data?.message || error.message || 'Registration failed'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Join Store Rating Platform
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Create your account to start rating stores
                    </p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-md">
                        <p className="text-xs text-blue-700 text-center">
                            <strong>Note:</strong> Registration is available for customers only. 
                            Store owners and administrators are managed separately.
                        </p>
                    </div>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name *
                            </label>
                            <input
                                {...register('name', {
                                    required: 'Full name is required',
                                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                                    maxLength: { value: 60, message: 'Name must not exceed 60 characters' }
                                })}
                                id="name"
                                type="text"
                                autoComplete="name"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your full name"
                                aria-invalid={!!errors.name}
                                required
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address *
                            </label>
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email address' }
                                })}
                                id="email"
                                type="email"
                                autoComplete="email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email address"
                                aria-invalid={!!errors.email}
                                required
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password *
                            </label>
                            <input
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                })}
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Create a password"
                                aria-invalid={!!errors.password}
                                required
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password *
                            </label>
                            <input
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: value => value === password || 'Passwords do not match'
                                })}
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Confirm your password"
                                aria-invalid={!!errors.confirmPassword}
                                required
                            />
                            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                        </div>

                        {/* Address */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address (Optional)
                            </label>
                            <textarea
                                {...register('address', { maxLength: { value: 400, message: 'Address must not exceed 400 characters' } })}
                                id="address"
                                rows={3}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your address (optional)"
                                aria-invalid={!!errors.address}
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                        </div>
                    </div>

                    {/* Submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    Creating your account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link to="/login" className="text-blue-600 hover:text-blue-500 text-sm">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
