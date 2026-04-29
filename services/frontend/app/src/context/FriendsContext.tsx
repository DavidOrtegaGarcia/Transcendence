import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import userService from '../services/userService';

interface FriendsContextType {
    friends: any[];
    isLoading: boolean;
    refreshFriends: () => Promise<void>;
    isFriend: (userId: number | string) => boolean;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [friends, setFriends] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshFriends = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await userService.getFriends(user.id);
            setFriends(data);
        } catch (error) {
            console.error("Error loading friends context", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refreshFriends();
    }, [refreshFriends]);

    const isFriend = (userId: number | string) => {
        return friends.some(f => Number(f.id) === Number(userId));
    };

    return (
        <FriendsContext.Provider value={{ friends, isLoading, refreshFriends, isFriend }}>
            {children}
        </FriendsContext.Provider>
    );
};

export const useFriends = () => {
    const context = useContext(FriendsContext);
    if (!context) throw new Error("useFriends must be used within FriendsProvider");
    return context;
};