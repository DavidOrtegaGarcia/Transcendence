import { FaUser, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ProfileHeaderProps {
    userData: {
        username: string;
        email: string;
        avatar?: string;
        bio?: string | null;
        experience?: number;
    };
    isOwnProfile: boolean;
}

const ProfileHeader = ({ userData, isOwnProfile }: ProfileHeaderProps) => {
    const { t } = useTranslation();

    const getFullAvatarUrl = (avatarPath?: string) => {
        if (!avatarPath) return undefined;

        if (avatarPath.startsWith('http') || avatarPath.startsWith('data:') || avatarPath.startsWith('/src/assets/')) {
            return avatarPath;
        }

        // Si es una ruta de base de datos como "avatars/xyz.png", le añadimos la ruta pública de Laravel
        const cleanPath = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
        return cleanPath.includes('storage/') ? cleanPath : `/storage${cleanPath}`;
    };

    const finalAvatarUrl = getFullAvatarUrl(userData.avatar);

    return (
        <div className="glass-panel p-6 md:p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4"></div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10">
                <div className="relative shrink-0">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-dark-800 shadow-2xl overflow-hidden bg-dark-900 flex items-center justify-center">
						
                        {finalAvatarUrl ? (
                            <img src={finalAvatarUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <FaUser className="text-slate-600 w-1/2 h-1/2" />
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row justify-between gap-6 w-full">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tighter">
                            {userData.username}
                        </h1>
                        <div className="inline-block px-4 py-1.5 rounded-full bg-dark-900/50 border border-white/10 mb-4">
                            <p className="text-slate-400 text-xs font-mono tracking-wide">{userData.email}</p>
                        </div>
                        <div className="max-w-md mx-auto md:mx-0">
                            <p className="text-slate-300 italic text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">
                                {userData.bio && userData.bio.trim() !== "" ? `"${userData.bio}"` : t('profile.no_bio')}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center lg:items-end justify-center gap-6">
                        <div className="bg-dark-900/60 p-4 rounded-xl border border-white/5 w-full md:w-64 backdrop-blur-sm">
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="text-brand-500 font-black text-xl tracking-tighter">LVL. 1</span>
                                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                    {userData.experience || 0} / 100 XP
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className="h-full bg-brand-500 shadow-[0_0_8px_rgba(var(--color-brand-500),0.4)]" 
                                    style={{ width: `${(userData.experience || 5) % 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {isOwnProfile && (
                            <Link to="/edit_profile" className="w-full md:w-auto">
                                <button className="btn-secondary rounded-full px-8 py-2.5 flex items-center justify-center gap-3 text-sm font-bold transition-all border border-white/10 hover:bg-white/5">
                                    <FaEdit className="text-brand-400" />
                                    {t('profile.edit_profile')}
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;