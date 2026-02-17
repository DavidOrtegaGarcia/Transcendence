import React from 'react';
import { FaUser, FaGamepad, FaTrash } from "react-icons/fa";
import { MdPersonSearch } from "react-icons/md";

interface FriendCardProps {
    name: string;
	icon: React.ReactNode;
	avatar?: string;
    variant?: 'online' | 'offline' | 'playing';
	onInviteClick?: () => void;
    onProfileClick?: () => void;
    onRemoveClick?: () => void;
}

const FriendCard = ({ name, icon, avatar, variant = 'offline', onProfileClick, onInviteClick, onRemoveClick }: FriendCardProps) => {
    
    const statusConfig = {
        online:  { ring: "border-success shadow-[0_0_10px_rgba(34,197,94,0.4)]", text: "text-success", label: "En línea" },
        offline: { ring: "border-slate-600", text: "text-slate-500", label: "Desconectado" },
        playing: { ring: "border-brand-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]", text: "text-brand-400", label: "Jugando..." }
    };

    const currentStatus = statusConfig[variant];
    const isPlayable = variant === 'online';

    return (
        <div className="group relative flex flex-col md:flex-row items-center justify-between p-4 gap-4 md:gap-0 glass-panel glass-panel-hover">
            
            {/* Left: Info */}
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`relative p-0.5 rounded-full border-2 ${currentStatus.ring} transition-all duration-300 shrink-0`}>
                    <div className="w-12 h-12 bg-dark-900 rounded-full flex items-center justify-center text-slate-300">
                        {avatar ? <img src={avatar} alt={`${name}'s avatar`} className="w-12 h-12 rounded-full object-cover" /> : <FaUser size={22} />}
                    </div>
                </div>
                <div className="flex flex-col text-left">
                    <h3 className="text-lg font-bold text-white tracking-wide font-sans group-hover:text-brand-400 transition-colors">
                        {name}
                    </h3>
               	    <span className={`flex flex-inline items-center text-xs uppercase tracking-wider font-bold ${currentStatus.text}`}>
						<span className="mr-1 text-[10px] opacity-80">
							{icon}
						</span>
						{currentStatus.label}
                   	</span>
			    </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center justify-around md:justify-end gap-3 w-full md:w-auto border-t border-white/5 pt-4 md:border-0 md:pt-0">
                
                <button 
                    onClick={isPlayable ? onInviteClick : undefined}
                    disabled={!isPlayable}
                    title={isPlayable ? "Invitar a jugar" : "No disponible"}
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