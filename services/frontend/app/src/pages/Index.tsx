import { useTranslation } from 'react-i18next';
import { FaUserFriends, FaUser, FaTrophy, FaImages, FaEdit } from "react-icons/fa";
import { GiCardPlay } from "react-icons/gi";
import DashboardLayout from '../components/layouts/DashboardLayout';
import DashboardCard from '../components/ui/DashboardCard';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { UserProfile } from '../models/User';
import { useAuth } from '../context/AuthContext';
import LoadingState from '../components/ui/LoadingState';

const Index = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	/*Eliminar cuando tenga BBDD */
	const { user, isLoading } = useAuth();

	console.log(user);

	if (isLoading)
		return <LoadingState />;

	if (!user) {
		return null;
	}

	/* State to save friend list */
	const [friendsList, setFriendsList] = useState<UserProfile[]>([]);

	/* Fetch fake para obtener amigos */
	useEffect(() => {
		/* Simulacion de fetch para obtener amigos */
		const fetchFriends = async () => {

			/* Simulacion de usuarios eliminar cuando tenga BBDD */
			const mockDatabaseResponse: UserProfile[] = [
				{ id: 1, name: "Miriam", status: "online", stats: { gamesPlayed: 0, wins: 0, losses: 0, winRate: 0 } },
				{ id: 2, name: "Ivan", status: "playing", stats: { gamesPlayed: 0, wins: 0, losses: 0, winRate: 0 } },
				{ id: 3, name: "Kevin", status: "online", stats: { gamesPlayed: 0, wins: 0, losses: 0, winRate: 0 } },
				{ id: 4, name: "David", status: "offline", stats: { gamesPlayed: 0, wins: 0, losses: 0, winRate: 0 } },
				{ id: 5, name: "Alice_Bot", status: "offline", stats: { gamesPlayed: 0, wins: 0, losses: 0, winRate: 0 } }
			];
			setFriendsList(mockDatabaseResponse);
		};
		fetchFriends();
	}, []);

	/* Real fetch cuando tenga la BBDD */
	// useEffect(() => {
	//     const fetchFriends = async () => {
	//         try {
	//             const response = await fetch('/api/friends');
	//             const data: UserProfile[] = await response.json();
	//             setFriendsList(data);
	//         } catch (error) {
	//             console.error("Error fetching friends:", error);
	//         }
	//     };
	//     fetchFriends();
	// }, []);


	return (
		<DashboardLayout isCentered={true}>

			<div className="max-w-5xl mx-auto w-full animate-fade-in-up pb-10">

				{/* Header with user info */}
				<div className="glass-panel p-8 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
					<div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/3"></div>
					<div className="relative group">
						<div className="w-32 h-32 rounded-full border-4 border-dark-800 shadow-2xl overflow-hidden bg-dark-900 flex items-center justify-center">
							{user.avatar ? (
								<img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
							) : (
								<FaUser className="text-slate-600 w-7/12 h-7/12 object-cover" />
							)}
						</div>
					</div>
					<div className="flex-1 text-center md:text-left z-10">
						<h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
						<p className="text-slate-400 text-sm mb-4 bg-dark-900/50 inline-block px-3 py-1 rounded-full border border-white/5">
							{user.email}
						</p>
						<div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
							<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-500 text-sm font-bold border border-brand-500/20">
								Lvl. 1
							</span>
							<Link to="/edit_profile">
								<button className="btn-icon btn-secondary px-6 py-1.5 gap-2 text-sm font-bold">
									<FaEdit /> {t('profile.edit_profile')}
								</button>
							</Link>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 animate-fade-in-up">
					{/* Play Card (Primary) */}
					<Link to="/game">
						<DashboardCard
							title={t('dashboard.play')}
							subtitle={t('dashboard.play')}
							icon={<GiCardPlay />}
							variant="primary"
							onClick={() => navigate('/game')}
						/>
					</Link>

					{/* Friends Card */}
					<Link to="/friends">
						<DashboardCard
							title={t('dashboard.friends') + ` (${friendsList.length})`}
							subtitle={`Online: ${friendsList.filter(f => f.status === 'online').length +
								friendsList.filter(f => f.status === 'playing').length
								}`}
							icon={<FaUserFriends />}
							onClick={() => navigate("/friends")}
						/>
					</Link>

					{/* Ranking Card */}
					<DashboardCard
						title={t('dashboard.ranking')}
						subtitle={t('dashboard.ranking_info')}
						icon={<FaTrophy />}
						onClick={() => navigate("/ranking")}
					/>

					{/* NUEVA: Collection Card */}
					<DashboardCard
						title={t('dashboard.collection') || "Collection"}
						subtitle={t('dashboard.collection_info') || "View your special cards"}
						icon={<FaImages />}
						onClick={() => navigate("/collection")}
					/>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default Index;