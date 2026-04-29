import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaGamepad, FaExclamationTriangle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdHistory, MdInsertChartOutlined } from "react-icons/md";
import { HiOutlineTrophy } from "react-icons/hi2";
import DashboardLayout from '../components/layouts/DashboardLayout';
import LoadingState from '../components/ui/LoadingState';
import PlayerBadge from '../components/ui/PlayerBadge';
import type { UserProfile } from '../models/User';
import type { CardData } from '../models/CardData';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import ProfileHeader from '../components/ui/ProfileHeader';
import StatBox from '../components/ui/StatsBox';
import AchievementCard from '../components/ui/AchievementCard';
import { useFriends } from '../context/FriendsContext';
import { useFriendActions } from '../services/userFriendActions';
import ConfirmModal from '../components/ConfirmModal';

const Profile = () => {
	const { t, i18n } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const { user: authUser, isLoading: isAuthLoading } = useAuth();
	const { friends, isFriend, refreshFriends } = useFriends();
	const { addFriend, respondRequest, removeFriend } = useFriendActions();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [profileData, setProfileData] = useState<UserProfile | null>(null);
	const [allCards, setAllCards] = useState<CardData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showAllAchievements, setShowAllAchievements] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const matchesPerPage = 5;

	const [relationStatus, setRelationStatus] = useState<'none' | 'pending' | 'accepted' | 'outgoing' | 'rejected' | 'loading'>('loading');

	const isOwnProfile = useMemo(() =>
		Boolean(!id || (authUser && Number(id) === Number(authUser.id))),
		[id, authUser]);

	const sortedAchievements = useMemo(() => {
		if (!profileData?.achievements) return [];
		return [...profileData.achievements].sort((a, b) => {
			if (a.is_unlocked !== b.is_unlocked) return a.is_unlocked ? -1 : 1;
			if (a.is_unlocked && b.is_unlocked) {
				if (a.claimed !== b.claimed) return a.claimed ? 1 : -1;
			}
			return 0;
		});
	}, [profileData?.achievements]);

	const displayedAchievements = useMemo(() =>
		showAllAchievements ? sortedAchievements : sortedAchievements.slice(0, 4),
		[showAllAchievements, sortedAchievements]);

	const fetchData = useCallback(async (isActive: boolean, showGlobalLoading: boolean) => {
		if (showGlobalLoading) {
			setIsLoading(true);
			setRelationStatus('loading');
		}

		try {
			const targetId = isOwnProfile ? authUser?.id : id;
			if (!targetId) return;

			// --- DEFINICIÓN DE VARIABLES PARA TS ---
			const targetIdNum = Number(targetId);
			const myId = Number(authUser?.id);
			const currentLang = i18n.language?.split('-')[0] || 'es';

			const [userData, catalogData] = await Promise.all([
				userService.getProfile(targetId, currentLang),
				userService.getAllCards(currentLang)
			]);

			if (isActive) {
				const formattedCatalog: CardData[] = catalogData.map((card: any) => {
					let mappedRarity = String(card.rarity).toLowerCase();
					if (mappedRarity.includes('golden')) mappedRarity = 'legendary';
					return {
						id: Number(card.id),
						name: card.name || '',
						description: card.description || '',
						category: card.category,
						rarity: mappedRarity as CardData['rarity'],
						stats: {
							top: card.stats?.top === 10 ? 'A' : card.stats?.top,
							right: card.stats?.right === 10 ? 'A' : card.stats?.right,
							bottom: card.stats?.bottom === 10 ? 'A' : card.stats?.bottom,
							left: card.stats?.left === 10 ? 'A' : card.stats?.left
						}
					};
				});

				// --- LÓGICA DE ESTADOS CORREGIDA ---
				let statusFinal: any = userData.friendship_status || 'none';

				if (!isOwnProfile) {
					// 1. Buscamos en la lista global (que sí tiene el requester_id)
					const friendship = friends.find((f: any) => {
						const fId = Number(f.id);
						const pUserId = Number(f.pivot?.user_id);
						const pFriendId = Number(f.pivot?.friend_id);
						return fId === targetIdNum || pUserId === targetIdNum || pFriendId === targetIdNum;
					});

					if (friendship) {
						const status = friendship.friendship_status || friendship.pivot?.status || friendship.status;
						// IMPORTANTE: El requester_id es la clave para saber si sale GRIS o VERDE
						const requesterId = Number(friendship.pivot?.requester_id || friendship.requester_id);

						if (status === 'accepted') {
							statusFinal = 'accepted';
						} else if (status === 'pending') {
							statusFinal = (requesterId === myId) ? 'outgoing' : 'pending';
						}
					} else if (isFriend(targetIdNum)) {
						statusFinal = 'accepted';
					}
				}

				setRelationStatus(statusFinal);
				setProfileData(userData);

				setAllCards(formattedCatalog);

			}
		} catch (error: any) {
			console.error("Error fetching profile:", error);
			if (isActive) setProfileData(null);
		} finally {
			if (isActive) setIsLoading(false);
		}
	}, [id, authUser, isOwnProfile, i18n.language, isFriend, friends]);

	// EFECTO UNIFICADO (Solo uno)
	useEffect(() => {
		if (isAuthLoading) return;
		let isActive = true;

		fetchData(isActive, true);

		const handleFriendshipUpdate = (e: any) => {
			refreshFriends();
			const remoteId = e.detail?.userId;
			if (remoteId && Number(remoteId) === Number(id)) {
				fetchData(isActive, false);
			}
		};

		window.addEventListener('friendshipRemoved', handleFriendshipUpdate);
		window.addEventListener('updateFriendNotifications', handleFriendshipUpdate);
		window.addEventListener('friendRequestHandled', handleFriendshipUpdate);

		return () => {
			isActive = false;
			window.removeEventListener('friendshipRemoved', handleFriendshipUpdate);
			window.removeEventListener('updateFriendNotifications', handleFriendshipUpdate);
			window.removeEventListener('friendRequestHandled', handleFriendshipUpdate);
		};
	}, [fetchData, isAuthLoading, id, refreshFriends]);

	const handleAddFriend = async (id: number | string) => {
		setRelationStatus('outgoing');
		try {
			await addFriend(id);
		} catch {
			fetchData(true, false);
		}
	};

	const handleRespondRequest = async (id: number | string, action: 'accept' | 'reject') => {
		try {
			await respondRequest(id, action);
			setRelationStatus(action === 'accept' ? 'accepted' : 'none');
		} catch { fetchData(true, false); }
	};

	const handleOpenDeleteModal = () => {
		setIsDeleteModalOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!id) return;
		try {
			await removeFriend(id);
			setRelationStatus('none');
		} catch (error) {
			fetchData(true, false);
		} finally {
			setIsDeleteModalOpen(false);
		}
	};

	const handleClaimReward = async (achievementId: number) => {
		try {
			const response = await userService.claimAchievement(achievementId);
			if (response) await fetchData(true, false);
		} catch (error) {
			console.error("Error claiming reward:", error);
		}
	};

	const getRelativeTime = (dateString: string | null | undefined) => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
		const rtf = new Intl.RelativeTimeFormat(i18n.language || 'en', { numeric: 'auto' });
		if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
		const diffInMinutes = Math.floor(diffInSeconds / 60);
		if (diffInMinutes < 60) return rtf.format(-diffInMinutes, 'minute');
		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) return rtf.format(-diffInHours, 'hour');
		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 30) return rtf.format(-diffInDays, 'day');
		const diffInMonths = Math.floor(diffInDays / 30);
		if (diffInMonths < 12) return rtf.format(-diffInMonths, 'month');
		const diffInYears = Math.floor(diffInDays / 365);
		return rtf.format(-diffInYears, 'year');
	};

	const formattedHistory = profileData?.match_history?.map(match => {
		const isPlayer1 = match.player_1_id === profileData?.id;
		const isWin = match.winner_id === profileData?.id;
		const resultString = match.winner_id === null ? 'draw' : (isWin ? 'win' : 'loss');
		const translatedResult = t(`profile.match_results.${resultString}`);
		const opponentName = isPlayer1 ? match.player_2_name : match.player_1_name;
		const rawAvatar = isPlayer1 ? match.player_2_avatar : match.player_1_avatar;
		const opponentId = isPlayer1 ? match.player_2_id : match.player_1_id;
		const opponentAvatar = rawAvatar === null ? undefined : rawAvatar;
		const scoreFormatted = isPlayer1 ? `${match.p1_score} - ${match.p2_score}` : `${match.p2_score} - ${match.p1_score}`;
		const dateFormatted = getRelativeTime(match.played_at);
		const getMatchStyles = (result: string) => {
			if (result === 'draw') return { border: 'bg-warning', badge: 'bg-warning/10 text-warning border border-warning/20' };
			return result === 'win' ? { border: 'bg-success', badge: 'bg-success/10 text-success border border-success/20' } : { border: 'bg-danger', badge: 'bg-danger/10 text-danger border border-danger/20' };
		};
		return { ...match, resultString, translatedResult, opponentId, opponentName, opponentAvatar, scoreFormatted, dateFormatted, styles: getMatchStyles(resultString) };
	}) || [];

	const totalPages = Math.ceil(formattedHistory.length / matchesPerPage);

	const currentMatches = useMemo(() => {
		const indexOfLastMatch = currentPage * matchesPerPage;
		const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
		return formattedHistory.slice(indexOfFirstMatch, indexOfLastMatch);
	}, [currentPage, formattedHistory]);

	if (isLoading) return <DashboardLayout isCentered={true}><LoadingState message={t('common.loading')} /></DashboardLayout>;

	return (
		<DashboardLayout isCentered={false}>
			<div className="max-w-5xl mx-auto w-full animate-fade-in-up pb-20 px-4 md:px-0">
				{profileData ? (
					<>
						<ProfileHeader
							userData={{
								...profileData,
								email: profileData.email || "",
								experience: profileData.stats?.experience || 0,
								level: profileData.stats?.level || 1,
								achievement_points: profileData.stats?.achievement_points || 0
							}}
							isOwnProfile={isOwnProfile}
							friendshipStatus={relationStatus}
							onAddFriend={handleAddFriend}
							onDeleteFriend={handleOpenDeleteModal}
							onRespondRequest={handleRespondRequest}
						/>

						<h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
							<MdInsertChartOutlined className="text-brand-400 text-2xl" /> {t('profile.stats')}
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
							{(() => {
								const wins = profileData.stats?.wins || 0;
								const losses = profileData.stats?.losses || 0;
								const draws = profileData.stats?.draws || 0;
								const gamesPlayed = wins + losses + draws;
								const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;
								return (
									<>
										<StatBox label={t('profile.games_played')} value={gamesPlayed} />
										<StatBox label={t('profile.wins')} value={wins} color="text-success" />
										<StatBox label={t('profile.draws')} value={draws} color="text-warning" />
										<StatBox label={t('profile.losses')} value={losses} color="text-danger" />
										<StatBox label={t('profile.win_rate')} value={`${winRate}%`} color="text-brand-400" />
									</>
								);
							})()}
						</div>

						<div className="flex justify-between items-center mb-4">
							<h3 className="text-xl font-bold text-white flex items-center gap-2">
								<HiOutlineTrophy className="text-warning text-2xl" /> {t('profile.achievements')}
							</h3>
							{sortedAchievements.length > 4 && (
								<button onClick={() => setShowAllAchievements(!showAllAchievements)} className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
									{showAllAchievements ? <><FaChevronUp /> {t('common.show_less')}</> : <><FaChevronDown /> {t('common.show_all')}</>}
								</button>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
							{displayedAchievements.map((ach) => (
								<AchievementCard key={ach.id} achievement={ach} isOwnProfile={isOwnProfile} rewardCard={ach.card_reward_id ? allCards.find(c => c.id === ach.card_reward_id) : null} onClaimReward={handleClaimReward} />
							))}
						</div>

						<h3 className="text-xl font-bold text-white mb-4 mt-10 flex items-center gap-2">
							<MdHistory className="text-brand-400 text-2xl" /> {t('profile.history')}
						</h3>
						{currentMatches.length > 0 ? (
							<>
								<div className="grid gap-4 lg:hidden">
									{currentMatches.map((match) => (
										<div key={match.id} className="glass-panel p-4 relative overflow-hidden">
											<div className={`absolute left-0 top-0 bottom-0 w-1 ${match.styles.border}`}></div>
											<div className="flex justify-between items-center w-full pl-3 mb-3">
												<div className="flex-1"><PlayerBadge avatar={match.opponentAvatar} name={match.opponentName} /></div>
												<div className="flex items-center gap-1 text-xs text-slate-500 bg-black/20 px-2 py-1 rounded-md shrink-0 ml-2">{match.dateFormatted}</div>
											</div>
											<div className="h-px bg-white/5 w-full mb-3 ml-3"></div>
											<div className="flex justify-between items-center pl-3">
												<span className={`px-3 py-1 rounded text-xs font-black uppercase tracking-widest ${match.styles.badge}`}>{match.translatedResult.toUpperCase()}</span>
												<span className="text-2xl font-mono font-bold text-white tracking-widest">{match.scoreFormatted}</span>
											</div>
										</div>
									))}
								</div>
								{/* Desktop Table */}
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
											{currentMatches.map((match) => (
												<tr key={match.id} className="hover:bg-white/5 transition-colors text-center relative group">
													<td className={`absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5 ${match.styles.border}`}></td>
													<td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${match.styles.badge}`}>{match.translatedResult.toUpperCase()}</span></td>
													<td className="px-6 py-4">
														<Link to={`/profile/${match.opponentId}`} className="flex justify-center hover:opacity-80 transition-opacity">
															<PlayerBadge avatar={match.opponentAvatar} name={match.opponentName} />
														</Link>
													</td>
													<td className="px-6 py-4 font-mono text-white font-bold tracking-widest">{match.scoreFormatted}</td>
													<td className="px-6 py-4">{match.dateFormatted}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								{/* CONTROLES DE PAGINACIÓN */}
								{totalPages > 1 && (
									<div className="flex justify-center items-center gap-4 mt-6">
										<button
											onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
											disabled={currentPage === 1}
											className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors text-sm font-bold"
										>
											{t('common.previous')}
										</button>

										<div className="flex gap-2">
											{[...Array(totalPages)].map((_, i) => (
												<button
													key={i}
													onClick={() => setCurrentPage(i + 1)}
													className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1
															? 'bg-brand-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
															: 'bg-white/5 text-slate-400 hover:text-white'
														}`}
												>
													{i + 1}
												</button>
											))}
										</div>

										<button
											onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
											disabled={currentPage === totalPages}
											className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors text-sm font-bold"
										>
											{t('common.next')}
										</button>
									</div>
								)}
							</>
						) : (
							<div className="glass-panel p-10 text-center flex flex-col items-center justify-center bg-dark-800/40 border border-white/5 rounded-xl">
								<FaGamepad className="text-4xl text-slate-600 mb-3" />
								<span className="text-slate-400 font-bold text-sm">{t('profile.no_history')}</span>
							</div>
						)}

						<ConfirmModal
							isOpen={isDeleteModalOpen}
							title={t('friends.remove_friend')}
							message={t('friends.remove_alert')}
							confirmText={t('common.accept')}
							cancelText={t('common.decline')}
							isDanger={true}
							onConfirm={handleConfirmDelete}
							onCancel={() => setIsDeleteModalOpen(false)}
						/>
					</>
				) : (
					<div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in glass-panel bg-dark-800/40 border border-danger-500/20">
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

export default Profile;