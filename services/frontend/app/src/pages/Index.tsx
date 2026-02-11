import { useTranslation } from 'react-i18next';
import { FaUserFriends, FaUser, FaTrophy } from "react-icons/fa";
import { GiCardPlay } from "react-icons/gi";
import DashboardLayout from '../components/layouts/DashboardLayout';
import DashboardCard from '../components/ui/DashboardCard';
import { Link, useNavigate } from 'react-router-dom';
import {useEffect, useState } from 'react';
import type { UserProfile } from '../models/User';

const Index = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
	/*Eliminar cuando tenga BBDD */
    const user = { username: "Miriam" };

	/* State to save friend list */
	const [friendsList, setFriendsList] = useState<UserProfile[]>([]);

	/* Fetch fake para obtener amigos */
	useEffect(() => {
		/* Simulacion de fetch para obtener amigos */
		const fetchFriends = async () => {
				
			/* Simulacion de usuarios eliminar cuando tenga BBDD */
			const mockDatabaseResponse: UserProfile[] = [
				{ id: 1, username: "Miriam", status: "online", stats: { gamesPlayed:0, wins:0, losses:0, winRate:0 } },
				{ id: 2, username: "Ivan", status: "playing", stats: { gamesPlayed:0, wins:0, losses:0, winRate:0 } },
				{ id: 3, username: "Kevin", status: "online", stats: { gamesPlayed:0, wins:0, losses:0, winRate:0 } },
				{ id: 4, username: "David", status: "offline", stats: { gamesPlayed:0, wins:0, losses:0, winRate:0 } },
				{ id: 5, username: "Alice_Bot", status: "offline", stats: { gamesPlayed:0, wins:0, losses:0, winRate:0 } }
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
            
            <div className="max-w-5xl mx-auto w-full animate-fade-in-up">
                <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-4 text-white drop-shadow-lg justify-center md:justify-start">
                    <span className="text-2xl md:text-4xl animate-wave">👋</span> 
                    {/* Using CSS utility for gradient */}
                    {t('dashboard.hello')}, <span className="text-gradient-nexus">{user.username}</span>
                </h1>
                <p className="text-slate-400 my-2 ml-1 text-lg text-center md:text-start md:justify-start">{t('dashboard.ready')}</p>
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

                <Link to="/friends">
                    <DashboardCard 
                        title={t('dashboard.friends') + ` (${friendsList.length})`}
                        subtitle={`Online: ${
							friendsList.filter(f => f.status === 'online').length + 
							friendsList.filter(f => f.status === 'playing').length
						}`}
                        icon={<FaUserFriends />}
                        onClick={() => navigate("/friends")}
                    />
                </Link>

                <Link to="/profile">
                    <DashboardCard 
                        title={t('dashboard.profile')} 
                        subtitle={t('dashboard.profile_info')}
                        icon={<FaUser />}
                        onClick={() => navigate("/profile")}
                    />
                </Link>

                <DashboardCard 
                    title={t('dashboard.ranking')} 
                    subtitle={t('dashboard.ranking_info')}
                    icon={<FaTrophy />}
                    onClick={() => navigate("/ranking")}
                />
            </div>
        </DashboardLayout>
    );
};

export default Index;