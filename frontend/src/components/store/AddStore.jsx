import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddStore = ({ onClose, onSuccess }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [storeOwners, setStoreOwners] = useState([]);

    useEffect(() => {
        fetchStoreOwners();
    }, []);

    const fetchStoreOwners = async () => {
        try {
            const response = await axios.get('/api/users', {
                params: { role: 'store_owner' }
            });
            setStoreOwners(response.data.users || []);
        } catch (error) {
            console.error('Failed to fetch store owners:', error);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await axios.post('/api/stores', {
                name: data.name,
                email: data.email,
                address: data.address,
                ownerId: data.ownerId || null
            });

            toast.success('Store created successfully!');
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create store');
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Add New Store</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Store Name
                        </label>
                        <input
                            {...register('name', {
                                required: 'Store name is required',
                                minLength: {
                                    value: 2,
                                    message: 'Store name must be at least 2 characters'
                                },
                                maxLength: {
                                    value: 60,
                                    message: 'Store name must not exceed 60 characters'
                                }
                            })}
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter store name"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: 'Invalid email format'
                                }
                            })}
                            type="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter store email"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <textarea
                            {...register('address', {
                                required: 'Address is required',
                                maxLength: {
                                    value: 400,
                                    message: 'Address must not exceed 400 characters'
                                }
                            })}
                            rows={3}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter store address"
                        />
                        {errors.address && (
                            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Store Owner (Optional)
                        </label>
                        <select
                            {...register('ownerId')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="">Select Owner (Optional)</option>
                            {storeOwners.map((owner) => (
                                <option key={owner.id} value={owner.id}>
                                    {owner.name} ({owner.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Store'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStore;
