import type { UserProfile } from "../models/User";

/* Login Credentials for logging in */
export interface LoginCredentials {
    email: string;
    password: string;
}

/* Register Credentials for registering */
export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
	password_confirmation: string;
}

/* User information for logged in user */
// export interface User {
//     id: string;
//     username: string;
//     email: string;
//     avatar?: string;
// 	experience: number;
// 	bio?: string;
// 	language?: 'EN' | 'ES' | 'CAT';
    
// }

export type User = UserProfile;

/* Auth context type provided to consuming components  */
export interface AuthContextType {
	/* Current user or null if not authenticated */
    user: User | null;
    setUser: (user: User | null) => void;
	/* Authentication state true or false*/
    isAuthenticated: boolean;
	/* Loading state to verify the cookie on reload */ 
    isLoading: boolean; 
	pendingFriendsCount: number;
	setPendingFriendsCount: (count: number) => void;
    login: (userData: LoginCredentials) => Promise<void>;
	register: (userData: RegisterCredentials) => Promise<void>;
    logout: () => void;
}