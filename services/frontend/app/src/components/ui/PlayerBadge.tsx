import { t } from "i18next";
import { FaUser } from "react-icons/fa";

interface PlayerBadgeProps {
    avatar?: string;
    username: string;
    isCurrentUser?: boolean;
    className?: string;
}

const PlayerBadge = ({ avatar, username, isCurrentUser = false, className = "" }: PlayerBadgeProps) => {
    return (
        /* Main Container centered */
        <div className={`flex items-center justify-center ${className}`}>
            
            {/* LEFT SIDE: Avatar + Space */}
            {/* Fixed width of 120px and content aligned to the end (right) */}
            <div className="w-30 flex justify-end items-center pr-4">
                <div className="w-10 h-10 shrink-0 rounded-full border border-white/10 bg-dark-800 overflow-hidden flex items-center justify-center">
                    {avatar ? (
                        <img src={avatar} alt={username} className="w-full h-full object-cover" />
                    ) : (
                        <FaUser className="text-slate-600 text-xs" />
                    )}
                </div>
            </div>

            {/* CENTER: Vertical Line */}
            <div className="shrink-0 w-px h-8 bg-white/10"></div>

            {/* RIGHT SIDE: Name + Badge */}
            {/* Same fixed width of 120px to maintain balance, aligned to the start (left) */}
            <div className="w-30 flex justify-start items-center pl-4">
                <div className="flex flex-col items-start min-w-0">
                    <span 
                        className={`font-bold truncate text-sm md:text-base leading-tight max-w-27.5 ${isCurrentUser ? "text-brand-400" : "text-white"}`}
                        title={username}
                    >
                        {username}
                    </span>
                    {isCurrentUser && (
                        <span className="text-[10px] bg-brand-500 text-white px-1.5 rounded font-bold tracking-wider mt-0.5">
                            {t('ranking.you')}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayerBadge;