import api from './api';
import type { UserProfile } from '../models/User';

/* This service will handle operations related to the user, such as getting their profile, updating it, etc. */
export interface UpdateProfilePayload {
	username: string;
	bio?: string;
	language?: string;
	password?: string;
	avatar?: string;
}

const userService = {
	/* Get user profile by id */
	getProfile: async (id: string | number): Promise<UserProfile> => {
		const response = await api.get(`/user`);
		return response.data;
	},
	/* Update user profile */
	updateProfile: async (formData: FormData): Promise<UserProfile> => {
		formData.append('_method', 'PATCH');
		const response = await api.post(`/api/v1/user/update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
		return response.data;
	},

	/* Update user password */
	updatePassword: async (password: string): Promise<any> => {
		const response = await api.put('/api/v1/user/password', { password });
		return response.data;
	},

	consoleLog: () => {
		console.log("Servicio de usuario listo");
	}
};

export default userService;