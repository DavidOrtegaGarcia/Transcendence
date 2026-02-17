import api from './api';
import type { UserProfile } from '../models/User';

/* This service will handle operations related to the user, such as getting their profile, updating it, etc. */
export interface UpdateProfilePayload {
    name: string;
    bio?: string;
    language?: string;
    password?: string;
    avatar?: string;
}

const userService = {
    /* Get user profile by id */
    getProfile: async (id: string | number): Promise<UserProfile> => {
        const response = await api.get(`/v1/users/${id}`);
        return response.data;
    },

	updateProfile: async (payload: UpdateProfilePayload): Promise<UserProfile> => {
        // Preguntar a Kevin si usa PUT para actualizar
        const response = await api.put(`/v1/users/profile`, payload);
        return response.data;
    },
    
    // 
    consoleLog: () => {
        console.log("Servicio de usuario listo");
    }
};

export default userService;