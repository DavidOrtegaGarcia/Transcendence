import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFriends } from '../context/FriendsContext';
import userService from '../services/userService';

export const useFriendActions = () => {
    const { user: authUser } = useAuth();
    const { refreshFriends } = useFriends();

    const addFriend = useCallback(async (friendId: number | string) => {
        if (!authUser) return;
        try {
            await userService.sendFriendRequest(authUser.id, friendId);
            await refreshFriends();
            window.dispatchEvent(new Event('updateFriendNotifications'));
        } catch (error) {
            console.error("Error adding friend:", error);
            throw error;
        }
    }, [authUser, refreshFriends]);

    const respondRequest = useCallback(async (friendId: number | string, action: 'accept' | 'reject') => {
        if (!authUser) return;
        try {
            if (action === 'accept') {
                await userService.respondFriendRequest(authUser.id, friendId, 'accept');
            } else {
                // Para rechazar, usamos removeFriend para limpiar la DB físicamente
                await userService.removeFriend(authUser.id, friendId);
            }
            await refreshFriends();
            window.dispatchEvent(new CustomEvent('friendRequestHandled'));
        } catch (error) {
            console.error(`Error ${action} request:`, error);
            throw error;
        }
    }, [authUser, refreshFriends]);

    const removeFriend = useCallback(async (friendId: number | string) => {
        if (!authUser) return;
        try {
            await userService.removeFriend(authUser.id, friendId);
            await refreshFriends();
            window.dispatchEvent(new CustomEvent('updateFriendNotifications', { 
                detail: { userId: friendId } 
            }));
        } catch (error) {
            console.error("Error removing friend:", error);
            throw error;
        }
    }, [authUser, refreshFriends]);

    return { addFriend, respondRequest, removeFriend };
};