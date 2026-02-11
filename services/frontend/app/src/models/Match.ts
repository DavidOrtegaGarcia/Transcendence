/* Definition of Match-related interfaces */

export interface MatchHistory {
    id: number;
	/* Opponent podría ser cambiado de string a object si necesitara más detalles, A TENER EN CUENTA */
    opponent: string;
    result: 'win' | 'loss';
    score: string;
    date: string;
}