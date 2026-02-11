/* MatchHistory imported to UserProfile to include match history */
import type { MatchHistory } from "./Match";

/* Definition of User-related interfaces */
export interface UserStats {
	gamesPlayed: number;
	wins: number;
	losses: number;
	// Winrate sera un porcentaje? será number o string?
	winRate: number; 
	// otros estadísticos según sea necesario
}

export interface UserProfile {
	id: number;
	username: string;
	email?: string;
	avatar?: string;
	status?: 'online' | 'offline' | 'playing';
	stats: UserStats;
	bio?: string;
    language?: 'en' | 'es' | 'ca';
	
	history?: MatchHistory[];
	// campos adicionales según sea necesario
}