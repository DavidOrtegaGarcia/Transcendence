import { useTranslation } from 'react-i18next';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import { FaGift } from "react-icons/fa";
import GameCard from './GameCard';
import type { CardData } from '../../models/CardData';

interface AchievementCardProps {
    achievement: {
        id: number;
        code: string;
        title: string;
        description: string;
        category: string;
        image_url?: string | null;
        goal: number;
        current_progress: number;
        points_reward: number;
        is_unlocked: boolean;
        claimed: boolean;
        unlocked_at?: string | null;
        card_reward_id?: number | null;
    };
    isOwnProfile: boolean;
    rewardCard?: CardData | null;
    onClaimReward: (id: number) => void;
}

const AchievementCard = ({ achievement, isOwnProfile, rewardCard, onClaimReward }: AchievementCardProps) => {
    const { t } = useTranslation();

    const progressPercent = Math.min(Math.round((achievement.current_progress / achievement.goal) * 100), 100);
    const showProgressBar = !achievement.is_unlocked && achievement.goal > 1;
    const canClaim = achievement.is_unlocked && !achievement.claimed;

    // Ajustamos la ruta según tu captura de VS Code: /assets/achievements/nombre.png
    const achImageUrl = `/assets/achievements/${achievement.code.toLowerCase()}.png`;

    const getContainerStyles = () => {
        if (!achievement.is_unlocked) {
            return "bg-dark-800/40 border-white/5 opacity-80"; 
        }
        if (canClaim) {
            return "bg-brand-500/10 border-brand-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)] animate-pulse-subtle"; 
        }
        return "bg-success/5 border-success/20"; 
    };

    const getCategoryStyles = () => {
        switch (achievement.category) {
            case 'bronze': return 'bg-orange-900/20 text-orange-400 border-orange-700/50';
            case 'silver': return 'bg-slate-700/20 text-slate-300 border-slate-500/50';
            case 'gold': return 'bg-yellow-900/20 text-yellow-400 border-yellow-600/50';
            case 'diamond': return 'bg-cyan-900/20 text-cyan-400 border-cyan-500/50';
            default: return 'bg-brand-900/20 text-brand-400 border-brand-500/50';
        }
    };

    return (
        <div className={`glass-panel p-4 flex flex-col sm:flex-row gap-4 border transition-all duration-300 ${getContainerStyles()}`}>
            
            {/* IZQUIERDA: IMAGEN CIRCULAR (Recortada y con efectos) */}
            <div className="shrink-0 flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/10 bg-dark-950 shadow-2xl group">
                    
                    {/* Imagen con efectos de estado (como el dorso de las cartas) */}
                    <img 
                        src={achievement.image_url ?? undefined} 
                        alt={achievement.title}
                        className={`w-full h-full object-cover transition-all duration-700 
                            ${!achievement.is_unlocked 
                                ? 'grayscale brightness-50 opacity-40 scale-110' // Modo inactivo (bloqueado)
                                : 'grayscale-0 brightness-100 opacity-100 scale-100 group-hover:scale-110'
                            }`}
                        onError={(e) => { 
                            // Fallback por si acaso algún nombre no coincide
                            (e.target as HTMLImageElement).src = achImageUrl; 
                        }}
                    />

                    {/* Candado overlay si está bloqueado */}
                    {!achievement.is_unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <FaLock className="text-white/30 text-xl" />
                        </div>
                    )}
                </div>
                
                {/* Categoría debajo de la imagen */}
                <span className={`text-[9px] font-black uppercase mt-2 px-2 py-0.5 rounded-full border tracking-tighter ${getCategoryStyles()}`}>
                    {achievement.category}
                </span>
            </div>

            {/* CENTRO: Info y Acciones */}
            <div className="flex-1 flex flex-col justify-between text-center sm:text-left py-1">
                <div>
                    <h4 className={`font-bold text-lg leading-tight mb-1 ${achievement.is_unlocked ? 'text-white' : 'text-slate-500'}`}>
                        {achievement.title}
                    </h4>
                    <p className={`text-[11px] italic line-clamp-2 leading-snug ${achievement.is_unlocked ? 'text-slate-400' : 'text-slate-600'}`}>
                        {achievement.description}
                    </p>
                </div>

                <div className="mt-3">
                    {canClaim ? (
                        isOwnProfile && (
                            <button
                                onClick={() => onClaimReward(achievement.id)}
                                className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white text-[10px] font-black py-2 px-5 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all transform hover:scale-105 active:scale-95 animate-pulse"
                            >
                                {t('profile.claim_reward')}
                            </button>
                        )
                    ) : (
                        <div className="space-y-2">
                            {/* Barra de progreso si está bloqueado */}
                            {showProgressBar && (
                                <div className="max-w-50 mx-auto sm:mx-0">
                                    <div className="flex justify-between text-[9px] font-bold mb-1">
                                        <span className="text-slate-600 uppercase">{t('profile.progress', 'Progreso')}</span>
                                        <span className="text-slate-500">{achievement.current_progress} / {achievement.goal}</span>
                                    </div>
                                    <div className="w-full bg-black/60 rounded-full h-1 border border-white/5 overflow-hidden">
                                        <div className="bg-slate-700 h-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Check de obtenido si ya está reclamado */}
                            {achievement.claimed && achievement.unlocked_at && (
                                <div className="text-[10px] text-success/60 font-mono flex items-center justify-center sm:justify-start gap-1">
                                    <FaCheckCircle className="text-success/40" />
                                    {t('profile.unlocked_on', 'Obtenido el')} {achievement.unlocked_at.split(' ')[0]}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* DERECHA: Puntos y Carta */}
            <div className="shrink-0 flex flex-col items-center justify-start gap-2.5 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-white/5 sm:border-t-0 sm:border-l sm:pl-3 w-full sm:w-21.25 min-h-27.5">

                {/* Bloque Superior: Siempre arriba */}
                <div className="flex flex-col items-center gap-1 w-full shrink-0">
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-400/10 border border-blue-400/20 shadow-[0_0_10px_rgba(96,165,250,0.05)]">
                        <FaGift className="text-blue-400 text-[9px]" />
                        <span className="text-[8px] text-blue-400 font-black uppercase tracking-tighter">
                            {t('profile.reward', 'Premio')}
                        </span>
                    </div>

                    <div className={`font-black text-sm leading-none ${achievement.is_unlocked ? 'text-warning' : 'text-slate-600'}`}>
                        +{achievement.points_reward}
                        <span className="text-[8px] ml-0.5 opacity-60 uppercase font-bold">pts</span>
                    </div>
                </div>

                {/* Bloque Inferior Centrado: Carta (si existe) */}
                {rewardCard ? (
                    <div className="relative group flex justify-center items-center flex-1 w-full min-h-15">
                        {/* Este div reserva el espacio para que la ampliación sea central */}
                        <div className="flex justify-center items-center w-12 h-16 pointer-events-none">
                            <div className={`w-9 h-13 sm:w-9.5 sm:h-13.5 shadow-xl rounded-sm transition-all duration-300 ease-out z-10 pointer-events-auto
                    ${achievement.is_unlocked
                                    ? 'group-hover:scale-120 cursor-pointer'
                                    : 'grayscale opacity-20 pointer-events-none'}`}
                            >
                                <GameCard
                                    card={rewardCard}
                                    isUnlocked={true}
                                    team="blue"
                                />
                            </div>
                        </div>

                        {/* Tooltip ultra-compacto y centrado */}
                        {achievement.is_unlocked && (
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[6px] font-black px-1.5 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none uppercase">
                                {t('profile.view', 'Ver')}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Espaciador sutil para mantener consistencia visual si no hay carta */
                    <div className="flex-1 w-full opacity-0"></div>
                )}
            </div>
        </div>
    );
};

export default AchievementCard;