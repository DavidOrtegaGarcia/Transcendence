import { useTranslation } from 'react-i18next';
import { FaSearch, FaCircle } from "react-icons/fa";
import DashboardLayout from '../components/layouts/DashboardLayout';
import FriendCard from '../components/ui/FriendCard';
import { useEffect, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import LoadingState from '../components/ui/LoadingState';
import type { UserProfile } from '../models/User';

const Friends = () => {
    const { t } = useTranslation();
	const navigate = useNavigate();

	/* State to save friend list */
    const [friendsList, setFriendsList] = useState<UserProfile[]>([]);
	// Usar UserProfile en lugar de FriendData cuando tenga la base de datos, usara UserProfile guargado en el models/User.ts
    // const [friendsList, setFriendsList] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

	/* State for Modal control (null = closed, number = open with ID) */
    const [friendToDelete, setFriendToDelete] = useState<number | null>(null);

	// Simulacion de fetch para obtener los amigos
	useEffect(() => {
        const fetchFriends = async () => {
            setIsLoading(true);
            
            /* Simulacion de delay */
            await new Promise(resolve => setTimeout(resolve, 500));

            // Datos fake que vendrían de la base de datos
            const mockDatabaseResponse: UserProfile[] = [
                { id: 1, name: "Miriam", status: "online", stats: { gamesPlayed:0, wins:0, losses:0, winRate:0 } },
                { id: 2, name: "Ivan", status: "playing", stats: { gamesPlayed:0, wins:0, losses:0, winRate:0 } },
                { id: 3, name: "Kevin", status: "online", stats: { gamesPlayed:0, wins:0, losses:0, winRate:0 } },
                { id: 4, name: "David", status: "offline", stats: { gamesPlayed:0, wins:0, losses:0, winRate:0 } },
                { id: 5, name: "Alice_Bot", status: "offline", stats: { gamesPlayed:0, wins:0, losses:0, winRate:0 } }
            ];

			/* Simulacion de error al cargar la lista de amigos o sin amigos comentando esta línea */
            setFriendsList(mockDatabaseResponse);

            setIsLoading(false);
        };

        fetchFriends();
    }, []);

	/* Real fetch cuando tenga la BBDD */
	// useEffect(() => {
	//     const fetchFriends = async () => {
	//         setIsLoading(true);
	//         try {
	//             const response = await api.get<FriendData[]>('/friends');
	//             setFriendsList(response.data);
	//         } catch (error) {
	//             console.error("Error al cargar la lista de amigos:", error);
	//             setFriendsList([]); // Vaciar lista en caso de error
	//         } finally {
	//             setIsLoading(false);
	//         }
	//     };
	// }, []);


    
	/* Handlers */

	/* Invite to play*/ 
    const handleInvite = (name: string) => {
        console.log(`Invitando a ${name}...`);
        navigate(`/game/`);
    };

	/* Show Profile*/
	const handleShowProfile = (name: string) => {
		console.log(`Mostrando perfil de ${name}...`);
        navigate(`/profile/${name}`);
	}

	/* Remove Friend */
	const confirmRemove = (id: number) => {
		setFriendToDelete(id);
	}
    const handleRemoveFriend = () => {
		if (friendToDelete === null)
			return;
        
        // Aquí llamaría a la API DELETE await api.delete(`/friends/${friendToDelete}`);

        /* Re-Render to remove friend visually */
        setFriendsList(prev => prev.filter(friend => friend.id !== friendToDelete));
		console.log(`Eliminando amigo ID: ${friendToDelete}`);

		/* Close modal */
        setFriendToDelete(null);
    };

    return (
        <DashboardLayout isCentered={false}>
            
            <div className="max-w-5xl mx-auto w-full animate-fade-in-up">
                
                {/* Header + Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8">
                    
                    {/* Title */}
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-md">
                            {t('friends.title')} <span className="text-brand-500 text-2xl align-center ml-1">({friendsList.length})</span>
                        </h1>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-96 group">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-500 transition-colors" />
                        <input
                            type="text"
                            placeholder={t('friends.search_placeholder')}
                            className="input-nexus pl-11"
                        />
                    </div>
                </div>

                {/* FRIENDS GRID */}
                {/* Conditional Render: Loading or Friends List */}
                
				{isLoading ? (
                    <LoadingState message={t('common.loading')} />
                ) : (
                    /* Dinamic Friend Grid */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 py-8">
                        {friendsList.length > 0 ? (
							/* Mapping over friendsList to render FriendCard components */
                            friendsList.map((friend) => (
                                <FriendCard
                                    key={friend.id}
                                    name={friend.name}
                                    variant={friend.status}
                                    icon={<FaCircle />}
                                    avatar={friend.avatar}
                                    onInviteClick={() => handleInvite(friend.name)}
                                    onProfileClick={() => handleShowProfile(friend.name)}
                                    onRemoveClick={() => confirmRemove(friend.id)}
                                />
                            ))
                        ) : (
                           <div className="col-span-full text-center py-10 text-slate-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                                {t('friends.no_friends')}
                            </div>
                        )}
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