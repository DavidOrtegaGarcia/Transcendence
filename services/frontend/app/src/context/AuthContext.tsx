import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthContextType } from './Auth';
import authService from '../services/authService';
import userService from '../services/userService';
import type { LoginCredentials, RegisterCredentials } from './Auth';
import i18n from '../i18n';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [pendingFriendsCount, setPendingFriendsCount] = useState<number>(0);

    const syncLanguage = (dbLanguage?: string) => {
        if (dbLanguage) i18n.changeLanguage(dbLanguage);
    };

    const refreshPendingCount = async (userId: number) => {
        try {
            const data = await userService.getFriends(userId);
            const pending = data.filter((f: any) => {
				const status = f.friendship_status || f.pivot?.status || f.status;
				const requesterId = Number(f.pivot?.requester_id || f.requester_id);
                return status === 'pending' && requesterId !== Number(userId);            
            	
            });
            setPendingFriendsCount(pending.length);
        } catch (error) {
            console.error("Error al cargar notificaciones de amigos", error);
        }
    };

    const checkSession = async () => {
        const isLoggedFlag = localStorage.getItem('is_logged_in');
        if (!isLoggedFlag) {
            setIsLoading(false);
            return;
        }

        try {
            const userData = await authService.getUser();
            setUser(userData);
            syncLanguage(userData.language);
            await refreshPendingCount(userData.id);
        } catch (error: any) {
            if (error.response?.status === 401)
                localStorage.removeItem('is_logged_in');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            setIsLoading(true);
            const userResponse = await authService.login(credentials);
            localStorage.setItem('is_logged_in', 'true');
            syncLanguage(userResponse.language);
            setUser(userResponse);
            await refreshPendingCount(userResponse.id);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (credentials: RegisterCredentials) => {
        try {
            setIsLoading(true);
            const userResponse = await authService.register(credentials);
            localStorage.setItem('is_logged_in', 'true');
            syncLanguage(userResponse.language);
            setUser(userResponse);
            setPendingFriendsCount(0);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Error: ", error);
        } finally {
            setUser(null);
            setPendingFriendsCount(0); // Limpiar contador al salir
            localStorage.removeItem('is_logged_in');
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
			setUser,
			isAuthenticated: !!user,
            isLoading,
            pendingFriendsCount,
            setPendingFriendsCount,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth should be used within an AuthProvider');
    return context;
};

export default AuthProvider;