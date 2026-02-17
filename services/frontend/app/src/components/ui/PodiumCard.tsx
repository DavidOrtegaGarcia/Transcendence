import { FaUser, FaCrown } from "react-icons/fa";
import type { UserProfile } from '../../models/User';

export interface PodiumCardProps {
    player: UserProfile & { points: number, stats: { wins: number, losses: number } };
    place: number;
    isWinner?: boolean;
    delay?: string;
}

const PodiumCard = ({ player, place, isWinner = false, delay = "0s" }: PodiumCardProps) => {
    
    const borderColor = isWinner ? "border-brand-500" : place === 2 ? "border-slate-400" : "border-orange-700";
    
    /* Heights: We maintain the step effect on desktop, but adapt on mobile. */
    const heightClass = isWinner 
        ? "h-auto py-8 md:py-0 md:h-[340px]" 
        : "h-auto py-6 md:py-0 md:h-[280px]"; 
        
    const crownColor = isWinner ? "text-amber-400" : place === 2 ? "text-slate-300" : "text-orange-400";
    const badgeColor = isWinner ? "bg-amber-400" : place === 2 ? "bg-slate-300" : "bg-orange-400";

    /* Unified avatar size: Always large */
    const avatarSizeClass = "w-28 h-28 md:w-32 md:h-32";

    return (
        <div 
            className={`
                relative flex flex-col items-center justify-end 
                w-full 
                ${heightClass} 
                animate-fade-in-up
                mb-0
            `}
            style={{ animationDelay: delay }}
        >
            {/* Floating Avatar */}
            <div className="relative md:absolute md:top-0 flex flex-col items-center z-20 mb-4 md:mb-0 transition-transform hover:-translate-y-2 duration-300">
                {isWinner && (
                    <FaCrown className={`text-4xl mb-2 ${crownColor} animate-bounce drop-shadow-lg`} />
                )}
                
                <div className="relative">
                    {/* We apply the unified size here */}
                    <div className={`
                        rounded-full border-4 ${borderColor} bg-dark-900 overflow-hidden shadow-2xl 
                        ${avatarSizeClass}
                    `}>
                        {player.avatar ? (
                            <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                                {/* Unified fallback icon size */}
                                <FaUser size={40} />
                            </div>
                        )}
                    </div>

                    {/* Number Badge */}
                    <div className={`
                        absolute -bottom-3 left-1/2 -translate-x-1/2 
                        w-8 h-8 md:w-10 md:h-10 flex items-center justify-center 
                        rounded-full font-black text-dark-900 border-2 border-dark-900 z-30
                        ${badgeColor} ${isWinner ? 'text-lg' : 'text-base'}
                    `}>
                        {place}
                    </div>
                </div>
            </div>

            {/* Glass Box */}
            <div className={`
                w-full md:h-[70%] glass-panel rounded-xl md:rounded-t-2xl md:rounded-b-xl md:border-t-0 
                flex flex-col justify-end items-center 
                pb-4 pt-10 md:pt-16
                bg-linear-to-b from-white/5 to-transparent
                ${isWinner ? 'border-brand-500/30' : 'border-white/5'}
            `}>
                <h3 className={`font-bold ${isWinner ? 'text-2xl text-white' : 'text-xl text-slate-200'} mb-1`}>
                    {player.name}
                </h3>
                <p className="text-brand-400 font-mono font-bold text-lg mb-2">
                    {player.points} <span className="text-xs text-slate-500 font-sans">PTS</span>
                </p>
                <div className="flex gap-4 text-xs text-slate-400 bg-black/20 px-3 py-1 rounded-full">
                    <span>W: <span className="text-success">{player.stats.wins}</span></span>
                    <span>L: <span className="text-danger">{player.stats.losses}</span></span>
                </div>
            </div>

            {/* Glow effect */}
            {isWinner && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-20 bg-brand-500/20 blur-[50px] -z-10"></div>
            )}
        </div>
    );
};

export default PodiumCard;