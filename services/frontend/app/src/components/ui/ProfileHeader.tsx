import { FaUser, FaEdit, FaUserPlus, FaHourglassHalf, FaTrophy, FaUserMinus, FaTimes, FaCheck } from "react-icons/fa"; // Añadido FaTrophy
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import userService from "../../services/userService";

interface ProfileHeaderProps {
	userData: {
		id?: number | string;
		username: string;
		email: string;
		avatar?: string | null;
		bio?: string | null;
		experience?: number;
		level?: number;
		achievement_points?: number;
	};
	isOwnProfile: boolean;
	friendshipStatus?: 'none' | 'pending' | 'accepted' | 'outgoing' | 'rejected' | 'loading';
	onAddFriend?: (id: number | string) => void;
	onDeleteFriend?: (id: number | string) => void;
	onRespondRequest?: (id: number | string, action: 'accept' | 'reject') => void;
}

const ProfileHeader = ({ userData, isOwnProfile, friendshipStatus = 'none', onAddFriend, onDeleteFriend, onRespondRequest }: ProfileHeaderProps) => {
	const { t } = useTranslation();
	const avatarUrl = userService.getFullAvatarUrl(userData.avatar || undefined);

	/* Level calculation based on experience points */
	const totalXp = userData.experience || 0;
	const nextLevelXp = Math.floor(100 * Math.pow((userData.level || 1), 1.5));
	const currentLevel = userData.level || 0;
	const achievementPoints = userData.achievement_points || 0;

	return (
		<div className="glass-panel p-6 md:p-8 mb-8 relative overflow-hidden">
			{/* Decoración de fondo */}
			<div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4"></div>

			<div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10">
				<div className="relative shrink-0">
					<div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-dark-800 shadow-2xl overflow-hidden bg-dark-900 flex items-center justify-center">
						{avatarUrl ? (
							<img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
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
						<div className="inline-flex items-center gap-3 mb-4">
							{isOwnProfile && (
								<div className="px-4 py-1.5 rounded-full bg-dark-900/50 border border-white/10">
									<p className="text-slate-400 text-xs font-mono tracking-wide">{userData.email}</p>
								</div>
							)}

							{/* RECUADRO DE PUNTOS DE LOGRO */}
							<div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/10 border border-warning/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
								<FaTrophy className="text-warning text-xs" />
								<span className="text-warning font-black text-xs tracking-wider">
									{achievementPoints}
								</span>
							</div>
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
								<span className="text-brand-500 font-black text-xl tracking-tighter">LVL. {currentLevel}</span>
								<span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
									{totalXp} / {nextLevelXp} XP
								</span>
							</div>
							<div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden border border-white/5">
								<div
									className="h-full bg-brand-500 shadow-[0_0_8px_rgba(59,130,246,0.4)] transition-all duration-500"
									style={{ width: `${(totalXp / nextLevelXp) * 100}%` }}
								></div>
							</div>
						</div>

						{/* Botones de acción */}
						{isOwnProfile ? (
							<Link to="/edit_profile" className="w-full md:w-auto">
								<button className="btn-secondary rounded-full px-8 py-2.5 flex items-center justify-center gap-3 text-sm font-bold transition-all border border-white/10 hover:bg-white/5 w-full">
									<FaEdit className="text-brand-400" />
									{t('profile.edit_profile')}
								</button>
							</Link>
						) : (
							<>
								{/* CASO: Solicitud pendiente -> Botón verde "Accept" -> Botón rojo "Decline" */}
								{friendshipStatus === 'pending' && (
									
									<div className="flex gap-2 animate-fade-in">
										<span className="flex align-items-center"> {t('friends.request_received')}</span>
										<button
											onClick={() => onRespondRequest && onRespondRequest(userData.id!, 'accept')}
											className="w-12 h-12 rounded-xl bg-success/20 text-success hover:bg-success hover:text-white flex items-center justify-center transition-all shadow-lg border border-success/20"
											title={t('common.accept')}
										>
											<FaCheck size={18} />
										</button>
										<button
											onClick={() => onRespondRequest && onRespondRequest(userData.id!, 'reject')}
											className="w-12 h-12 rounded-xl bg-danger/20 text-danger hover:bg-danger hover:text-white flex items-center justify-center transition-all shadow-lg border border-danger/20"
											title={t('common.decline')}
										>
											<FaTimes size={18} />
										</button>
									</div>
								)}

								{/* CASO: No hay relación */}
								{friendshipStatus === 'none' && (
									<button
										onClick={() => onAddFriend && onAddFriend(userData.id!)}
										className="btn-primary rounded-full px-8 py-2.5 w-full flex items-center justify-center gap-3 text-sm font-bold animate-fade-in"
									>
										<FaUserPlus /> {t('friends.add_friend')}
									</button>
								)}

								{/* CASO: Solicitud enviada */}
								{friendshipStatus === 'outgoing' && (
									<div className="px-8 py-2.5 rounded-full border border-slate-500/30 bg-slate-500/10 text-slate-400 flex items-center justify-center gap-3 text-sm font-bold cursor-default animate-fade-in shadow-inner">
										<FaHourglassHalf className="text-xs" /> {t('friends.sent')}
									</div>
								)}

								{/* CASO: Ya son amigos -> Botón rojo "Delete" */}
								{friendshipStatus === 'accepted' && (
									<button
										onClick={() => onDeleteFriend && onDeleteFriend(userData.id!)}
										className="px-8 py-2.5 rounded-full border border-danger/30 bg-danger/10 text-danger flex items-center justify-center gap-3 text-sm font-bold hover:bg-danger/20 transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] animate-fade-in"
									>
										<FaUserMinus className="text-sm" /> {t('friends.remove_friend')}
									</button>
								)}

								{/* 5. LOADING: Spinner while fetching */}
								{friendshipStatus === 'loading' && (
									<div className="px-8 py-2.5 flex items-center justify-center">
										<div className="w-5 h-5 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileHeader;