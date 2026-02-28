import { useTranslation } from 'react-i18next';
import { FaUserFriends, FaTrophy, FaImages } from "react-icons/fa";
import { GiCardPlay } from "react-icons/gi";
import DashboardLayout from '../components/layouts/DashboardLayout';
import DashboardCard from '../components/ui/DashboardCard';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { UserProfile } from '../models/User';
import { useAuth } from '../context/AuthContext';
import LoadingState from '../components/ui/LoadingState';
import ProfileHeader from '../components/ui/ProfileHeader';
import GameModeModal from '../components/ui/GameModeModal';

const Index = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, isLoading } = useAuth();

    /* State to save friend list */
    const [friendsList, setFriendsList] = useState<UserProfile[]>([]);
    
    /* State to control the visibility of the mode selector */
    const [showModeSelector, setShowModeSelector] = useState(false);

    /* Fetch fake para obtener amigos */
    useEffect(() => {
        const fetchFriends = async () => {
            const mockDatabaseResponse: UserProfile[] = [
                { id: 1, username: "Miriam", status: "online", stats: { gamesPlayed: 0, wins: 0, losses: 0, winRate: 0 } },
                { id: 2, username: "Ivan", status: "playing", stats: { gamesPlayed: 0, wins: 0, losses: 0, winRate: 0 } },
                { id: 3, username: "Kevin", status: "online", stats: { gamesPlayed: 0, wins: 0, losses: 0, winRate: 0 } },
                { id: 4, username: "David", status: "offline", stats: { gamesPlayed: 0, wins: 0, losses: 0, winRate: 0 } },
                { id: 5, username: "Alice_Bot", status: "offline", stats: { gamesPlayed: 0, wins: 0, losses: 0, winRate: 0 } }
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

    if (isLoading) return <LoadingState />;

    if (!user) return null;

    return (
        <DashboardLayout isCentered={false}>
            <div className="max-w-5xl mx-auto w-full animate-fade-in-up pb-10">

                {/* Header with user info (Se le pasa el user entero, el ProfileHeader ya sabe qué hacer) */}
                <ProfileHeader userData={user} isOwnProfile={true} />

                {/* Contenedor del Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 animate-fade-in-up">
                    
                    {/* Play Card (Primary) - Abre el Modal */}
                    <DashboardCard
                        title={t('dashboard.play')}
                        subtitle={t('dashboard.select_mode')}
                        icon={<GiCardPlay />}
                        variant="primary"
                        onClick={() => setShowModeSelector(true)}
                    />
                    
                    {/* Friends Card */}
                    <DashboardCard
                        title={t('dashboard.friends') + ` (${friendsList.length})`}
                        subtitle={`Online: ${friendsList.filter(f => f.status === 'online').length + friendsList.filter(f => f.status === 'playing').length}`}
                        icon={<FaUserFriends />}
                        onClick={() => navigate("/friends")}
                    />

                    {/* Ranking Card */}
                    <DashboardCard
                        title={t('dashboard.ranking')}
                        subtitle={t('dashboard.ranking_info')}
                        icon={<FaTrophy />}
                        onClick={() => navigate("/ranking")}
                    />

                    {/* Collection Card */}
                    <DashboardCard
                        title={t('dashboard.collection') }
                        subtitle={t('dashboard.collection_info')}
                        icon={<FaImages />}
                        onClick={() => navigate("/collection")}
                    />
                </div>
                
            </div>

            {/* Modal de Modos de Juego */}
            <GameModeModal 
                isOpen={showModeSelector} 
                onClose={() => setShowModeSelector(false)} 
            />
            
        </DashboardLayout>
    );
};

export default Index;