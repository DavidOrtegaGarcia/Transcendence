import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaGamepad, FaTrophy, FaExclamationTriangle } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
import DashboardLayout from '../components/layouts/DashboardLayout';
import LoadingState from '../components/ui/LoadingState';
import PlayerBadge from '../components/ui/PlayerBadge';
import type { UserProfile } from '../models/User';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import ProfileHeader from '../components/ui/ProfileHeader';

const Profile = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();

    /* Get authenticated user from context */
    const { user: authUser, isLoading: isAuthLoading } = useAuth();

    /* Determine if viewing own profile or another user's */
    const isOwnProfile = Boolean(!id || (authUser && id === authUser.id.toString()));

    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const getMatchStyles = (result: 'win' | 'loss') => {
        const isWin = result === 'win';
        return {
            border: isWin ? 'bg-success' : 'bg-danger',
            badge: isWin
                ? 'bg-success/10 text-success border border-success/20'
                : 'bg-danger/10 text-danger border border-danger/20'
        };
    };

    useEffect(() => {
        if (isAuthLoading) return;

        const fetchProfileData = async () => {
            setIsLoading(true);
            try {
                const targetId = id || authUser?.id;
                if (!targetId) throw new Error("No user specified");

                const data = await userService.getProfile(targetId);
                setProfileData(data);
            } catch (error: any) {
                console.error("Error al obtener los datos de la base de datos:", error);
                setProfileData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [id, authUser, isAuthLoading]);

    if (isLoading) return <DashboardLayout isCentered={true}><LoadingState message={t('common.loading')} /></DashboardLayout>;

    return (
        <DashboardLayout isCentered={false}>
            <div className="max-w-5xl mx-auto w-full animate-fade-in-up pb-20">
                {profileData ? (
                    <>
                        {/* HEADER: Le pasamos el avatar tal cual viene de BD, el componente lo procesa */}
                        <ProfileHeader
                            userData={{
                                username: profileData.username,
                                email: profileData.email || "",
                                avatar: profileData.avatar,
                                bio: profileData.bio,
                                experience: profileData.experience
                            }}
                            isOwnProfile={isOwnProfile}
                        />

                        {/* STATS */}
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FaTrophy className="text-warning" /> {t('profile.stats')}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            <StatBox label={t('profile.games_played')} value={profileData.stats?.gamesPlayed || 0} />
                            <StatBox label={t('profile.wins')} value={profileData.stats?.wins || 0} color="text-success" />
                            <StatBox label={t('profile.losses')} value={profileData.stats?.losses || 0} color="text-danger" />
                            <StatBox label={t('profile.win_rate')} value={`${profileData.stats?.winRate || 0}%`} color="text-brand-400" />
                        </div>

                        {/* HISTORY */}
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><MdHistory className="text-brand-400" /> {t('profile.history')}</h3>

                        {profileData.history && profileData.history.length > 0 ? (
                            <>
                                {/* --- MOBILE VIEW --- */}
                                <div className="grid gap-4 lg:hidden">
                                    {profileData.history.map((match) => {
                                        const styles = getMatchStyles(match.result);
                                        return (
                                            <div key={match.id} className="glass-panel p-4 relative overflow-hidden">
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${styles.border}`}></div>
                                                <div className="flex justify-between items-center w-full pl-3 mb-3">
                                                    <div className="flex-1">
                                                        <PlayerBadge
                                                            avatar={undefined}
                                                            name={match.opponent}
                                                            className="justify-start! [&>div:first-child]:w-auto [&>div:first-child]:pr-3 [&>div:last-child]:w-auto [&>div:last-child]:pl-3"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-slate-500 bg-black/20 px-2 py-1 rounded-md shrink-0 ml-2">
                                                        {match.date}
                                                    </div>
                                                </div>
                                                <div className="h-px bg-white/5 w-full mb-3 ml-3"></div>
                                                <div className="flex justify-between items-center pl-3">
                                                    <span className={`px-3 py-1 rounded text-xs font-black uppercase tracking-widest ${styles.badge}`}>
                                                        {match.result}
                                                    </span>
                                                    <span className="text-2xl font-mono font-bold text-white tracking-widest">
                                                        {match.score}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* DESKTOP TABLE */}
                                <div className="hidden lg:block glass-panel overflow-hidden">
                                    <table className="w-full text-left text-sm text-slate-400">
                                        <thead className="bg-white/5 text-slate-200 uppercase text-xs font-bold">
                                            <tr className="text-center">
                                                <th className="px-6 py-4 w-8"></th>
                                                <th className="px-6 py-4 w-40">{t('profile.result')}</th>
                                                <th className="px-6 py-4 text-center">{t('profile.opponent')}</th>
                                                <th className="px-6 py-4 w-40">{t('profile.score')}</th>
                                                <th className="px-6 py-4 w-44">{t('profile.date')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {profileData.history.map((match) => {
                                                const styles = getMatchStyles(match.result);
                                                return (
                                                    <tr key={match.id} className="hover:bg-white/5 transition-colors text-center relative group">
                                                        <td className={`absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5 ${styles.border}`}></td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold ${styles.badge}`}>{match.result.toUpperCase()}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex justify-center">
                                                                <PlayerBadge avatar={undefined} name={match.opponent} />
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 font-mono text-white font-bold tracking-widest">{match.score}</td>
                                                        <td className="px-6 py-4">{match.date}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="glass-panel p-10 text-center flex flex-col items-center justify-center">
                                <FaGamepad className="text-4xl text-slate-600 mb-3" />
                                <span className="text-slate-400 font-bold">{t('profile.no_history')}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                        <div className="w-16 h-16 bg-danger-500/10 rounded-full flex items-center justify-center mb-4 border border-danger-500/20"><FaExclamationTriangle className="text-3xl text-danger-500" /></div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('profile.error_loading')}</h3>
                        <p className="text-slate-400 max-w-md mb-6">{t('errors.database_error')}</p>
                        <button onClick={() => window.location.reload()} className="btn-secondary px-6 py-2 rounded-lg text-sm font-bold hover:bg-white/10 transition-colors">{t('profile.try_again')}</button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

/* --- StatBox Component --- */
interface StatBoxProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: string;
}

const StatBox = ({ label, value, icon, color = "text-white" }: StatBoxProps) => (
    <div className="glass-panel p-4 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
        <span className={`flex text-3xl font-black mb-1 ${color}`}>{value}</span>
        <span className="text-xs text-slate-400 uppercase tracking-wider font-bold flex items-center gap-2">{icon} {label}</span>
    </div>
);

export default Profile;