export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface GameCard {
    id: string;
    name: string;
    rarity: CardRarity;
    cost: number; // Ej: common=0, rare=1, epic=2, legendary=3
    image: string; // URL de la imagen
    stats: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
}