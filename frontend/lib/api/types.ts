// User Types
export interface User {
    _id: string;
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    bio?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

// Post Types
export interface Post {
    _id: string;
    content?: string;
    image?: string;
    privacy: 'public' | 'private';
    author: User;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePostData {
    content?: string;
    image?: File;
    privacy: 'public' | 'private';
}

// Comment Types
export interface Comment {
    _id: string;
    content: string;
    author: User;
    post: string;
    parentComment?: string;
    replies?: Comment[];
    repliesCount?: number;
    createdAt: string;
    updatedAt: string;
}

// Like Types
export interface Like {
    _id: string;
    user: User;
    targetType: 'Post' | 'Comment';
    targetId: string;
    createdAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        token: string;
        user: User;
    };
}

export interface PostsResponse {
    success: boolean;
    data: Post[];
}

export interface CommentsResponse {
    success: boolean;
    data: Comment[];
}

export interface LikesResponse {
    success: boolean;
    data: Like[];
    count: number;
}

export interface ToggleLikeResponse {
    success: boolean;
    liked: boolean;
    message: string;
}

// Error Types
export interface ApiError {
    status: number;
    message: string;
    errors?: any[];
}
