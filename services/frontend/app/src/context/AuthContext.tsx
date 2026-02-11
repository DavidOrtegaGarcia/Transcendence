import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthContextType } from './Auth';
import authService from '../services/authService';

/* Creamos el contexto de autenticación con un valor inicial undefined, lo que nos ayudará a detectar si el hook se usa fuera del provider. */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* Este componente envolverá toda la aplicación y proporcionará el estado de autenticación a través del contexto. */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    // Iniciamos isLoading en true para que la app espere a verificar la sesión antes de mostrar nada
    const [isLoading, setIsLoading] = useState<boolean>(true);

	/* Esta función se encargará de verificar si el usuario ya tiene una sesión activa al cargar la página. */
    const checkSession = async () => {
        try {
            // Intentamos obtener el usuario al cargar la página
            const userData = await authService.getUser();
            setUser(userData);
        } catch (error) {
            // Si falla (401 Unauthorized), significa que no hay sesión o expiró
            // No es un error, simplemente no está logueado
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    // Login REAL
    const login = async (userData: any) => { 
        try {
            setIsLoading(true);
            // Esto llama al backend -> cookie -> session
            const userResponse = await authService.login(userData);
            setUser(userResponse);
        } catch (error) {
            console.error("Error login", error);
            throw error; // Lanzamos el error para que el componente Login pueda mostrar una alerta
        } finally {
            setIsLoading(false);
        }
    };

    // Logout REAL
    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
        } catch (error) {
            console.error("Error logout", error);
            // Incluso si falla la petición de logout, limpiamos el estado local
            setUser(null);
        }
    };

	/* El provider pasa el estado y las funciones de login/logout a los componentes hijos a través del contexto. */
    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated: !!user, 
            isLoading, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

/* Este hook personalizado nos permite acceder al contexto de autenticación desde cualquier componente que lo necesite. */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth should be used within an AuthProvider');
    return context;
};

export default AuthProvider;