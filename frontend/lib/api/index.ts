import { apiClient } from './client';
import {
    AuthResponse,
    ApiResponse,
    PostsResponse,
    CommentsResponse,
    LikesResponse,
    ToggleLikeResponse,
    RegisterData,
    LoginCredentials,
    Post,
    Comment,
} from './types';

// Authentication API
export const authApi = {
    register: async (userData: RegisterData): Promise<AuthResponse> => {
        return apiClient.post<AuthResponse>('/auth/register', userData);
    },

    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        return apiClient.post<AuthResponse>('/auth/login', credentials);
    },

    getProfile: async (): Promise<ApiResponse<any>> => {
        return apiClient.get<ApiResponse<any>>('/auth/profile');
    },
};

// Posts API
export const postsApi = {
    createPost: async (formData: FormData): Promise<ApiResponse<Post>> => {
        return apiClient.post<ApiResponse<Post>>('/posts', formData);
    },

    getPosts: async (): Promise<PostsResponse> => {
        return apiClient.get<PostsResponse>('/posts');
    },

    getPost: async (postId: string): Promise<ApiResponse<Post>> => {
        return apiClient.get<ApiResponse<Post>>(`/posts/${postId}`);
    },

    updatePost: async (postId: string, formData: FormData): Promise<ApiResponse<Post>> => {
        return apiClient.put<ApiResponse<Post>>(`/posts/${postId}`, formData);
    },

    deletePost: async (postId: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<ApiResponse<void>>(`/posts/${postId}`);
    },
};

// Comments API
export const commentsApi = {
    createComment: async (postId: string, content: string): Promise<ApiResponse<Comment>> => {
        return apiClient.post<ApiResponse<Comment>>(`/posts/${postId}/comments`, { content });
    },

    getComments: async (postId: string): Promise<CommentsResponse> => {
        return apiClient.get<CommentsResponse>(`/posts/${postId}/comments`);
    },

    createReply: async (commentId: string, content: string): Promise<ApiResponse<Comment>> => {
        return apiClient.post<ApiResponse<Comment>>(`/comments/${commentId}/replies`, { content });
    },

    getReplies: async (commentId: string): Promise<CommentsResponse> => {
        return apiClient.get<CommentsResponse>(`/comments/${commentId}/replies`);
    },

    deleteComment: async (commentId: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<ApiResponse<void>>(`/comments/${commentId}`);
    },
};

// Likes API
export const likesApi = {
    toggleLike: async (targetType: 'Post' | 'Comment', targetId: string): Promise<ToggleLikeResponse> => {
        return apiClient.post<ToggleLikeResponse>('/likes', { targetType, targetId });
    },

    getLikes: async (targetType: 'Post' | 'Comment', targetId: string): Promise<LikesResponse> => {
        return apiClient.get<LikesResponse>(`/likes/${targetType}/${targetId}`);
    },

    getLikeUsers: async (targetType: 'Post' | 'Comment', targetId: string): Promise<ApiResponse<any>> => {
        return apiClient.get<ApiResponse<any>>(`/likes/${targetType}/${targetId}/users`);
    },
};
