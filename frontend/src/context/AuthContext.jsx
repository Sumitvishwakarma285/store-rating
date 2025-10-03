import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Set up axios defaults - Fixed for Vite
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://store-rating-api.onrender.com';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            verifyToken();
        } else {
            setLoading(false);
        }
    }, []);

    const verifyToken = async () => {
        try {
            const response = await axios.get('/api/auth/verify');
            setUser(response.data.user);
        } catch (error) {
            console.error('Token verification failed:', error);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const response = await axios.post('/api/auth/login', { email, password });
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        
        return user;
    };

    const register = async (userData) => {
        const response = await axios.post('/api/auth/register', userData);
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        
        return user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
