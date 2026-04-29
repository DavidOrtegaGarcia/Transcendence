import React from 'react';
import { FaUser, FaGamepad, FaTrash } from "react-icons/fa";
import { MdPersonSearch } from "react-icons/md";
import userService from '../../services/userService';
import { useTranslation } from 'react-i18next';

interface FriendCardProps {
    name: string;
    icon: React.ReactNode;
    avatar?: string;
    status?: 'online' | 'offline' | 'playing' | 'away';
    onInviteClick?: () => void;
    onProfileClick?: () => void;
    onRemoveClick?: () => void;
}

const FriendCard = ({ name, icon, avatar, status = 'offline', onProfileClick, onInviteClick, onRemoveClick }: FriendCardProps) => {
    const { t } = useTranslation();
    const avatarUrl = userService.getFullAvatarUrl(avatar);
    const statusConfig = {
        online: { ring: "border-success shadow-[0_0_10px_rgba(34,197,94,0.4)]", text: "text-success", label: t('friends.online') },
        offline: { ring: "border-slate-600", text: "text-slate-500", label: t('friends.offline') },
        playing: { ring: "border-brand-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]", text: "text-brand-400", label: t('friends.playing') },
        away: { ring: "border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]", text: "text-yellow-500", label: t('friends.away') },
        queueing: { ring: "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]", text: "text-blue-400", label: t('friends.queueing') },

    };

    const currentStatus = statusConfig[status];
    const isPlayable = status === 'online';

    return (
        <div className="group relative flex flex-col md:flex-row items-center justify-between p-4 gap-4 md:gap-0 glass-panel glass-panel-hover">

            {/* Left: Info */}
            <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                    onClick={onProfileClick}
                    className="flex items-center gap-4 text-left group/info focus:outline-none"
                >
                    <div className="w-12 h-12 bg-dark-900 rounded-full flex items-center justify-center text-slate-300 border border-white/5 group-hover/info:border-brand-500/50 transition-colors overflow-hidden">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={`${name}'s avatar`} className="w-full h-full object-cover" />
                        ) : (
                            <FaUser size={22} />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-white tracking-wide group-hover/info:text-brand-400 transition-colors">
                            {name}
                        </h3>
                        <span className={`flex items-center text-xs uppercase tracking-wider font-bold ${currentStatus.text}`}>
                            <span className="mr-1 text-[10px] opacity-80">{icon}</span>
                            {currentStatus.label}
                        </span>
                    </div>
                </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center justify-around md:justify-end gap-3 w-full md:w-auto border-t border-white/5 pt-4 md:border-0 md:pt-0">

                <button
                    onClick={isPlayable ? onInviteClick : undefined}
                    disabled={!isPlayable}
                    title={isPlayable ? t('friends.invite') : t('friends.not_available')}
                    className={`btn-icon ${isPlayable ? "btn-primary" : "btn-disabled"}`}
                >
                    <FaGamepad size={24} />
                </button>

                <button onClick={onProfileClick} title="Ver Perfil" className="btn-icon btn-secondary">
                    <MdPersonSearch size={24} />
                </button>

                <div className="hidden md:block h-8 w-px bg-white/10 mx-1"></div>

                <button onClick={onRemoveClick} title="Eliminar amigo" className="btn-icon btn-danger">
                    <FaTrash size={22} />
                </button>
            </div>
        </div>
    );
};

export default FriendCard;