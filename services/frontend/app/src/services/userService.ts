import api from './api';
import type { UserProfile } from '../models/User';
import type { RankingUser, PlayerStats } from '../models/RankingUser';

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
	getProfile: async (id?: string | number, lang: string = 'es'): Promise<UserProfile> => {
		const noCache = new Date().getTime();
		const url = id
			? `/v1/users/${id}?lang=${lang}&_t=${noCache}`
			: `/v1/user?lang=${lang}&_t=${noCache}`;

		const response = await api.get(url, {
			headers: { 'Accept-Language': lang }
		});
		return response.data;
	},

	/* Update user profile */
	updateProfile: async (formData: FormData): Promise<UserProfile> => {
		formData.append('_method', 'PATCH');
		const response = await api.post(`/v1/user/update`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
		return response.data;
	},

	/* Update user password */
	updatePassword: async (password: string): Promise<any> => {
		const response = await api.put('/v1/user/password/update', { password });
		return response.data;
	},

	/* Get full URL for avatar images */
	getFullAvatarUrl: (avatarPath?: string) => {
		if (!avatarPath)
			return undefined;

		/* If an avatar comes as an external URL (Google) or a data:image */
		if (avatarPath.startsWith('http') || avatarPath.startsWith('data:')) {
			return avatarPath;
		}

		/* If the avatar path is relative, ensure it starts with a slash */
		return avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
	},

	/* Update language preference */
	updateLanguage: async (language: 'en' | 'es' | 'ca'): Promise<UserProfile> => {
		const response = await api.patch('/v1/user/update', { language });
		return response.data;
	},

	/* Search users  */
	searchUsers: async (query: string): Promise<UserProfile[]> => {
		const response = await api.get(`/v1/users?search=${query}`);
		return response.data.data || response.data;
	},

	/* Get FriendList and requests */
	getFriends: async (userId: string | number): Promise<any[]> => {
		const response = await api.get(`/v1/users/${userId}/friends`);
		return response.data.data || response.data;
	},

	/* Send Friend request */
	sendFriendRequest: async (userId: string | number, friendId: string | number): Promise<any> => {
		const response = await api.post(`/v1/users/${userId}/friends/${friendId}`);
		return response.data;
	},

	/* Accept or decline friend request */
	respondFriendRequest: async (userId: string | number, friendId: string | number, action: 'accept' | 'reject'): Promise<any> => {
		const response = await api.patch(`/v1/users/${userId}/friends/${friendId}`, { action });
		return response.data;
	},

	acceptFriendRequest: async (friendId: string | number): Promise<any> => {
		// Asumiendo que tu API usa PATCH y requiere el ID del amigo
		// Ajusta la URL según tu backend, por ejemplo: /v1/friends/accept/${friendId}
		const response = await api.patch(`/v1/friends/accept/${friendId}`);
		return response.data;
	},

	/* Delete friend */
	removeFriend: async (userId: string | number, friendId: string | number): Promise<any> => {
		const response = await api.delete(`/v1/users/${userId}/friends/${friendId}`);
		return response.data;
	},

	/*Claim achievement*/
	claimAchievement: async (achievementId: string | number): Promise<any> => {
		const response = await api.post(`/v1/achievements/${achievementId}/claim`);
		return response.data;
	},

	/* Get ALL cards */
	/* Save language preference in the header and force to refresh to avoid cache errors */
	getAllCards: async (lang: string = 'es'): Promise<any[]> => {
		const noCache = new Date().getTime();

		const response = await api.get(`/v1/cards?lang=${lang}&_t=${noCache}`, {
			headers: { 'Accept-Language': lang }
		});
		return response.data.data || response.data;
	},

	/* Get User cards */
	/* Save language preference in the header and force to refresh to avoid cache errors */
	getCards: async (lang: string = 'es'): Promise<any[]> => {
		const noCache = new Date().getTime();

		const response = await api.get(`/v1/user/cards?lang=${lang}&_t=${noCache}`, {
			headers: { 'Accept-Language': lang }
		});
		return response.data.data || response.data;
	},

	/* Get Ranking */
	getRanking: async (): Promise<(RankingUser & { stats: PlayerStats })[]> => {
		const response = await api.get<{ data: (RankingUser & { stats: PlayerStats })[] }>(`/v1/ranking`);
		return response.data.data;
	},

	consoleLog: () => {
		console.log("Servicio de usuario listo");
	}
};

export default userService;