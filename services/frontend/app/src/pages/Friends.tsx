import { useTranslation } from 'react-i18next';
import { FaSearch, FaCircle, FaUserPlus, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import DashboardLayout from '../components/layouts/DashboardLayout';
import FriendCard from '../components/ui/FriendCard';
import { useEffect, useState, useRef } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import LoadingState from '../components/ui/LoadingState';
import type { UserProfile } from '../models/User';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

// Interfaz extendida para manejar el estado de la amistad y la tabla pivot
interface FriendProfile extends UserProfile {
	friendship_status?: 'pending' | 'accepted' | 'rejected';
	pivot?: {
		status: 'pending' | 'accepted' | 'rejected';
		requester_id: number;
		user_id?: number;
		friend_id?: number;
	}
}

const Friends = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { user: authUser } = useAuth();

	/* States list */
	const [friendsList, setFriendsList] = useState<FriendProfile[]>([]);
	const [pendingRequests, setPendingRequests] = useState<FriendProfile[]>([]);
	const [outgoingRequests, setOutgoingRequests] = useState<FriendProfile[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	/* Search states */
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	/* Modal control */
	const [friendToDelete, setFriendToDelete] = useState<number | null>(null);

	/* Close dropdown if clicked outside */
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setShowDropdown(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	/* Fetch friends from database */
	useEffect(() => {
		fetchFriendsData();

		/* Global event listener to update friends list when we accept/decline from friends page or receive new request */
		window.addEventListener('updateFriendNotifications', fetchFriendsData);

		/* Cleanup the listener when we leave the page */
		return () => {
			window.removeEventListener('updateFriendNotifications', fetchFriendsData);
		};
	}, [authUser]);

	const fetchFriendsData = async () => {
		if (!authUser) return;
		setIsLoading(true);
		try {
			const data = await userService.getFriends(authUser.id);

			const myId = Number(authUser.id);

			/* Auxiliar functions, is used to handle different response formats from the backend */
			const getStatus = (f: any) => f.friendship_status || f.pivot?.status || f.status;
			const getRequester = (f: any) => Number(f.pivot?.requester_id || f.requester_id);

			/* Friends accepted */
			const accepted = data.filter((f: any) => getStatus(f) === 'accepted');

			/* Request received */
			const incoming = data.filter((f: any) => {
				const status = getStatus(f);
				const isRequester = getRequester(f) === myId;
				return status === 'pending' && !isRequester;
			});

			/* Request sent */
			const outgoing = data.filter((f: any) => {
				const status = getStatus(f);
				const isRequester = getRequester(f) === myId;
				return status === 'pending' && isRequester;
			});

			setFriendsList(accepted);
			setPendingRequests(incoming);
			setOutgoingRequests(outgoing);

		} catch (error) {
			console.error("Error", error);
			setFriendsList([]);
			setPendingRequests([]);
			setOutgoingRequests([]);
		} finally {
			setIsLoading(false);
		}
	};

	/* Search user using a filter in frontend */
	useEffect(() => {
		const delayDebounceFn = setTimeout(async () => {
			if (searchQuery.trim().length >= 2) {
				setIsSearching(true);
				setShowDropdown(true);
				try {
					const allUsers = await userService.searchUsers(searchQuery);

					const filteredResults = allUsers.filter(u =>
						u.username?.toLowerCase().includes(searchQuery.toLowerCase())
					);

					setSearchResults(filteredResults);
				} catch (error) {
					console.error("Error:", error);
					setSearchResults([]);
				} finally {
					setIsSearching(false);
				}
			} else {
				setSearchResults([]);
				setShowDropdown(false);
			}
		}, 500);

		return () => clearTimeout(delayDebounceFn);
	}, [searchQuery]);

	/* Listen for real-time status changes from SocketContext */
	useEffect(() => {
		const handleStatusChange = (e: any) => {
			const { userId, newStatus } = e.detail;

			setFriendsList((prevFriends) =>
				prevFriends.map((friend) =>
					Number(friend.id) === Number(userId)
						? { ...friend, status: newStatus }
						: friend
				)
			);
		};

		window.addEventListener('friendStatusChanged', handleStatusChange);

		return () => {
			window.removeEventListener('friendStatusChanged', handleStatusChange);
		};
	}, []);

	/* Send friend request */
	const handleSendRequest = async (friendId: number) => {
		if (!authUser)
			return;
		try {
			await userService.sendFriendRequest(authUser.id, friendId);
			console.log(`Solicitud enviada al ID ${friendId}`);

			const friendData = searchResults.find(u => Number(u.id) === friendId);
			if (friendData) {

				// Añadimos el objeto de amigo simulando la respuesta del backend
				const optimisticFriend = {
					...friendData,
					friendship_status: 'pending',
					pivot: {
						status: 'pending',
						requester_id: Number(authUser.id),
						friend_id: friendId,
						user_id: Number(authUser.id)
					}
				} as FriendProfile;

				setOutgoingRequests(prev => [...prev, optimisticFriend]);
			}

			/* Timeout to show sent state before closing dropdown and clear search */
			setTimeout(() => {
				setShowDropdown(false);
				setSearchQuery("");
			}, 1500);

			setShowDropdown(false);
			setSearchQuery("");
		} catch (error) {
			console.error("Error", error);
		}
	};

	/* Accept or reject friend request */
	const handleRespondRequest = async (friendId: number, action: 'accept' | 'reject') => {
		if (!authUser) return;
		try {
			await userService.respondFriendRequest(authUser.id, friendId, action);
			console.log(`Solicitud ${action} para el ID ${friendId}`);

			if (action === 'accept') {
				const acceptedFriend = pendingRequests.find(f => Number(f.id) === friendId);
				if (acceptedFriend) {
					setFriendsList(prev => [...prev, { ...acceptedFriend, friendship_status: 'accepted' }]);
				}
			}
			setPendingRequests(prev => prev.filter(f => Number(f.id) !== friendId));

			/* Global event to update friend notifications count in Navbar */
			window.dispatchEvent(new CustomEvent('friendRequestHandled'));

		} catch (error) {
			console.error(`Error ${action}: `, error);
		}
	};

	const confirmRemove = (id: number | string) => setFriendToDelete(Number(id));

	/* Remove friend */
	const handleRemoveFriend = async () => {
		if (friendToDelete === null || !authUser) return;
		try {
			await userService.removeFriend(authUser.id, friendToDelete);
			console.log(`Amigo eliminado ID: ${friendToDelete}`);
			setFriendsList(prev => prev.filter(friend => Number(friend.id) !== friendToDelete));
		} catch (error) {
			console.error("Error: ", error);
		} finally {
			setFriendToDelete(null);
		}
	};

	/* Navigation */
	const handleInvite = (username?: string) => {
		if (!username) return;
		console.log(`Sending invitation to ${username}...`);
		navigate(`/game/`);
	};

	const handleShowProfile = (id?: number | string) => {
		if (!id) return;
		navigate(`/profile/${id}`);
	};

	return (
		<DashboardLayout isCentered={false}>
			<div className="max-w-5xl mx-auto w-full animate-fade-in-up pb-20">

				{/* Header + Search */}
				<div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8 mb-8">
					<div className="text-center md:text-left">
						<h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-md">
							{t('friends.title')} <span className="text-brand-500 text-2xl align-center ml-1">({friendsList.length})</span>
						</h1>
					</div>

					{/* Search container with dropdown */}
					<div className="relative w-full md:w-96" ref={dropdownRef}>
						<div className="relative group">
							<FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-500 transition-colors z-10" />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder={t('friends.search_placeholder')}
								className="input-nexus pl-11 w-full"
							/>
							{isSearching && <FaSpinner className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-500 animate-spin z-10" />}
						</div>

						{/* Dropdown results */}
						{showDropdown && (
							<div className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
								{searchResults.length > 0 ? (
									<ul className="max-h-60 overflow-y-auto custom-scrollbar">
										{searchResults.map((userResult) => {
											const resultId = Number(userResult.id);
											const authId = Number(authUser?.id);

											const isSelf = resultId === authId;
											const checkIsMatch = (f: any, id: number) => {
												return Number(f.id) === id ||
													Number(f.pivot?.friend_id) === id ||
													Number(f.pivot?.user_id) === id ||
													Number(f.friend_id) === id ||
													Number(f.user_id) === id;
											};

											const isAlreadyFriend = friendsList.some(f => checkIsMatch(f, resultId));
											const isPending = pendingRequests.some(f => checkIsMatch(f, resultId));
											const isOutgoing = outgoingRequests.some(f => checkIsMatch(f, resultId));
											return (
												<li key={resultId} className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">

													{/* Avatar and Name for Profile clickable */}
													<button
														className="flex items-center gap-3 text-left focus:outline-none"
														onClick={() => handleShowProfile(resultId)}
													>
														<div className="w-8 h-8 rounded-full bg-dark-900 border border-white/10 overflow-hidden flex items-center justify-center">
															{userResult.avatar ? (
																<img
																	src={userService.getFullAvatarUrl(userResult.avatar)}
																	alt="user avatar"
																	className="w-full h-full object-cover"
																/>
															) : (
																<FaUserPlus className="text-slate-600" />
															)}
														</div>
														<span className="text-white font-bold text-sm hover:text-brand-400 transition-colors">{userResult.username}</span>
													</button>

													{/* Action Button - The action button is kept on the right */}
													<div className="flex items-center gap-2">
														{isSelf ? (
															<span className="text-xs text-slate-500 font-bold px-2">{t('common.you')}</span>
														) : isAlreadyFriend ? (
															<span className="text-xs text-success font-bold px-2 flex items-center gap-1">
																<FaCheck /> {t('friends.already_friend')}
															</span>
														) : isOutgoing ? (
															/* I sent the request -> Show Sent status */
															<span className="text-xs text-slate-500 font-bold px-2 border border-slate-500/30 rounded-full py-1">
																{t('friends.sent')}
															</span>
														) : isPending ? (
															/* He sent it to me -> Show Accept/Reject buttons */
															<div className="flex gap-1">
																<button
																	onClick={() => handleRespondRequest(resultId, 'accept')}
																	className="p-1.5 bg-success/20 text-success hover:bg-success hover:text-white rounded-lg transition-colors"
																	title={t('common.accept')}
																>
																	<FaCheck size={14} />
																</button>
																<button
																	onClick={() => handleRespondRequest(resultId, 'reject')}
																	className="p-1.5 bg-danger/20 text-danger hover:bg-danger hover:text-white rounded-lg transition-colors"
																	title={t('common.decline')}
																>
																	<FaTimes size={14} />
																</button>
															</div>
														) : (
															/* No friendship -> Show Add Friend button */
															<button
																onClick={() => handleSendRequest(resultId)}
																className="text-xs bg-brand-500 hover:bg-brand-400 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-colors"
															>
																<FaUserPlus /> {t('friends.add_friend')}
															</button>
														)}
													</div>
												</li>
											);
										})}
									</ul>
								) : (
									<div className="p-4 text-center text-sm text-slate-400">
										{t('friends.player_not_found')}
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				{isLoading ? (
					<LoadingState message={t('common.loading')} />
				) : (
					<div className="space-y-12">

						{/* Pending Requests Section */}
						{pendingRequests.length > 0 && (
							<section className="animate-fade-in">
								<h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-warning animate-pulse"></span>
									{t('friends.pending_requests')} ({pendingRequests.length})
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{pendingRequests.map((req) => (
										<div key={req.id} className="glass-panel p-4 flex items-center justify-between border-l-4 border-l-warning">
											<div className="flex items-center gap-4">
												<button
													onClick={() => handleShowProfile(req.id)}
													className="w-12 h-12 rounded-full bg-dark-900 border border-white/10 overflow-hidden flex items-center justify-center hover:border-brand-500/50 transition-colors shrink-0"
												>
													{req.avatar ? (
														<img src={userService.getFullAvatarUrl(req.avatar)} alt="" className="w-full h-full object-cover" />
													) : (
														<FaUserPlus className="text-slate-600" />
													)}
												</button>

												<div className="flex flex-col items-start">
													{/* Nombre interactivo */}
													<button
														onClick={() => handleShowProfile(req.id)}
														className="text-white font-bold hover:text-brand-400 transition-colors text-left"
													>
														{req.username}
													</button>
													<p className="text-xs text-slate-400">{t('friends.request_sent')}</p>
												</div>
											</div>
											<div className="flex gap-2">
												<button onClick={() => handleRespondRequest(Number(req.id), 'accept')} className="w-10 h-10 rounded-lg bg-success/20 text-success hover:bg-success hover:text-white flex items-center justify-center transition-colors">
													<FaCheck />
												</button>
												<button onClick={() => handleRespondRequest(Number(req.id), 'reject')} className="w-10 h-10 rounded-lg bg-danger/20 text-danger hover:bg-danger hover:text-white flex items-center justify-center transition-colors">
													<FaTimes />
												</button>
											</div>
										</div>
									))}
								</div>
							</section>
						)}

						{/* Friend List Section */}
						<section>
							<h2 className="text-xl font-bold text-slate-300 mb-4">{t('friends.subtitle')}</h2>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
								{friendsList.length > 0 ? (
									friendsList.map((friend) => (
										<FriendCard
											key={friend.id}
											name={friend.username}
											status={friend.status}
											icon={<FaCircle />}
											avatar={friend.avatar || undefined}
											onInviteClick={() => handleInvite(friend.username)}
											onProfileClick={() => handleShowProfile(friend.id)}
											onRemoveClick={() => confirmRemove(friend.id)}
										/>
									))
								) : (
									<div className="col-span-full text-center py-12 text-slate-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
										{t('friends.no_friends')}
									</div>
								)}
							</div>
						</section>

					</div>
				)}

				{/* Confirm Modal */}
				<ConfirmModal
					isOpen={friendToDelete !== null}
					title={t('friends.remove_friend')}
					message={t('friends.remove_alert')}
					confirmText={t('common.accept')}
					cancelText={t('common.decline')}
					isDanger={true}
					onConfirm={handleRemoveFriend}
					onCancel={() => setFriendToDelete(null)}
				/>

			</div>
		</DashboardLayout>
	);
};

export default Friends;