'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { User as ApiUser } from '@/lib/api/types';

// Extend API User type to include both _id and id for compatibility
interface User extends ApiUser {
    id?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (userData: any) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Load user on mount
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await authApi.getProfile();
            setUser(response.data);
        } catch (err) {
            console.error('Failed to load user:', err);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            const response = await authApi.login({ email, password });

            // Save token
            localStorage.setItem('token', response.data.token);

            // Set user
            setUser(response.data.user);

            // Redirect to home
            router.push('/');

            return { success: true };
        } catch (err: any) {
            const errorMessage = err.message || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const register = async (userData: any) => {
        try {
            setError(null);
            const response = await authApi.register(userData);

            // Save token
            localStorage.setItem('token', response.data.token);

            // Set user
            setUser(response.data.user);

            // Redirect to home
            router.push('/');

            return { success: true };
        } catch (err: any) {
            const errorMessage = err.message || 'Registration failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    const value: AuthContextType = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
