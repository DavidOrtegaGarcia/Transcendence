import api from './api';
import type { LoginCredentials, RegisterCredentials, User } from '../context/Auth';

const authService = {
    /* Get CSRF token from Laravel Sanctum */
    getCsrfToken: async (): Promise<void> => {
        await api.get('/sanctum/csrf-cookie'); 
    },

    /* Login */
    login: async (creds: LoginCredentials): Promise<User> => {        
		/* Security handshake to get the cookie CSRF */
        await authService.getCsrfToken();
		/* Send credentials to backend, Sanctum will create the session if everithing is ok */
        await api.post('/login', creds);
		/* If login is successful, get the current user to update the authentication state in the frontend */
        return authService.getUser();
    },
	
    /* Register */
    register: async (data: RegisterCredentials): Promise<User> => {
        await authService.getCsrfToken();
        await api.post('/register', data);
        return authService.getUser();
		
    },

    /* Logout */
    logout: async (): Promise<void> => {        
        await api.post('/logout');
    },

    /** getUser to obtain actual user (Check Session) */
	getUser: async (): Promise<User> => {
        const response = await api.get(`/v1/user`);
        return response.data;  
    }
};

export default authService;