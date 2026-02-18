import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUser, FaGamepad, FaEdit, FaTrophy, FaExclamationTriangle } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
import DashboardLayout from '../components/layouts/DashboardLayout';
import LoadingState from '../components/ui/LoadingState';
import PlayerBadge from '../components/ui/PlayerBadge'; 
import type { UserProfile } from '../models/User';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import authService from '../services/authService';

const Profile = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    
    /* Get authenticated user from context */
    const { user: authUser, isLoading: isAuthLoading } = useAuth();
	console.log("Authenticated user from context:", authUser);
	console.log("Auth loading state:", isAuthLoading);

    /* Determine if viewing own profile or another user's */
    const isOwnProfile = !id || (authUser && id === authUser.id.toString());

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
        // 1. Esperamos a que la autenticación termine
        if (isAuthLoading) return;

        const fetchProfileData = async () => {
            setIsLoading(true);
            try {
				// En peticiones GET de Sanctum, si ya estás logueado, 
				// withCredentials: true en api.ts es suficiente.
				const targetId = id || authUser?.id;
				if (!targetId) throw new Error("No user specified");

				const data = await userService.getProfile(targetId);
				setProfileData(data);
			} catch (error: any) {
                // 4. Si el usuario no existe, el backend devolverá 404. 
                // El catch lo atrapará y pondrá profileData a null, mostrando el triángulo de error.
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
                        {/* HEADER */}
                        <div className="glass-panel p-8 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/3"></div>
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full border-4 border-dark-800 shadow-2xl overflow-hidden bg-dark-900 flex items-center justify-center">
                                    {profileData.avatar ? <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" /> : <FaUser className="text-slate-600 w-7/12 h-7/12 object-cover" />}
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left z-10">
                                <h1 className="text-4xl font-bold text-white mb-2">{profileData.name}</h1>
                                {isOwnProfile && <p className="text-slate-400 text-sm mb-4 bg-dark-900/50 inline-block px-3 py-1 rounded-full border border-white/5">{profileData.email}</p>}
                                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                                    {isOwnProfile ? (
                                        <Link to="/edit_profile"><button className="btn-icon btn-secondary px-6 gap-2 text-sm font-bold"><FaEdit /> {t('profile.edit_profile')}</button></Link>
                                    ) : (
                                        <button className="btn-icon btn-primary px-6 gap-2 text-sm font-bold"><FaGamepad size={20} /> {t('dashboard.play')}</button>
                                    )}
                                </div>
                            </div>
                        </div>

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