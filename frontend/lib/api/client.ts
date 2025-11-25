import { ApiError } from './types';

// API Base URL Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

// API Client with automatic token handling
class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }

    async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getToken();

        const headers: Record<string, string> = {
            ...options.headers,
        };

        // Add Content-Type for JSON requests
        if (options.body && !(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        // Add Authorization header if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            ...options,
            headers,
        };

        // Convert body to JSON string if it's an object and not FormData
        if (config.body && !(config.body instanceof FormData)) {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                const error: ApiError = {
                    status: response.status,
                    message: data.message || 'An error occurred',
                    errors: data.errors || [],
                };
                throw error;
            }

            return data;
        } catch (error: any) {
            if (error.status) {
                throw error;
            }
            const networkError: ApiError = {
                status: 500,
                message: 'Network error. Please check your connection.',
            };
            throw networkError;
        }
    }

    get<T = any>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    post<T = any>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body,
        });
    }

    put<T = any>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body,
        });
    }

    delete<T = any>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
