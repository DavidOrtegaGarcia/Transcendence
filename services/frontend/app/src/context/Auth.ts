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
export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
	experience: number;
	bio?: string;
    // Añadir mas campos cuando sepamos los que necesitamos
}

/* Auth context type provided to consuming components  */
export interface AuthContextType {
	/* Current user or null if not authenticated */
    user: User | null;
	/* Authentication state true or false*/
    isAuthenticated: boolean;
	/* Loading state to verify the cookie on reload */ 
    isLoading: boolean; 
	/* This will be the API call to log in */
    login: (userData: LoginCredentials) => Promise<void>;
	register: (userData: RegisterCredentials) => Promise<void>;
	/* This will be the API call to log out */
    logout: () => void;
}