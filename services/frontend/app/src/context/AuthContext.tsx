import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthContextType } from './Auth';
import authService from '../services/authService';
import type { LoginCredentials, RegisterCredentials } from './Auth';
import { langMapper } from '../utils/langMapper';
import i18n from '../i18n';

/* Creamos el contexto de autenticación con un valor inicial undefined, lo que nos ayudará a detectar si el hook se usa fuera del provider. */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* Este componente envolverá toda la aplicación y proporcionará el estado de autenticación a través del contexto. */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    // Iniciamos isLoading en true para que la app espere a verificar la sesión antes de mostrar nada
    const [isLoading, setIsLoading] = useState<boolean>(true);

	// Función para sincronizar el idioma del usuario con i18n
	const syncLanguage = (dbLanguage?: string) => {
        if (dbLanguage) {
            const targetLang = langMapper[dbLanguage] || 'en';
            i18n.changeLanguage(targetLang);
            localStorage.setItem('lang', targetLang);
        }
    };

	/* Esta función se encargará de verificar si el usuario ya tiene una sesión activa al cargar la página. */
    const checkSession = async () => {
		/* Para evitar hacer una petición innecesaria al backend cada vez que recargamos, podemos usar un flag en localStorage que indique si el usuario ha iniciado sesión antes. Esto no es 100% seguro, pero ayuda a reducir la cantidad de peticiones al backend. Si el flag no está presente, asumimos que no hay sesión y no hacemos la petición. Si el flag está presente, intentamos obtener el usuario para verificar si la sesión sigue activa. Así evito el error de consola ya que el backend me devuelve un 401 si no hay sesión. Todos los codigos 4xx y 5xx muestran error en consola, con esto evito al backend falsear el 401 por un 200(null) return response()->json(null); desde php */
		const isLoggedFlag = localStorage.getItem('is_logged_in');

		/* Si el flag no está presente, no hacemos la petición y simplemente establecemos isLoading en false. */
		if (!isLoggedFlag) {
            setIsLoading(false);
            return;
        }

        try {
            // Intentamos obtener el usuario al cargar la página
            const userData = await authService.getUser();
            setUser(userData);
			syncLanguage(userData.language);
        } catch (error: any) {
            // Si falla (401 Unauthorized), significa que no hay sesión o expiró
            // No es un error, simplemente no está logueado para evitar el error en consola, eliminamos el flag de localStorage y limpiamos el estado de usuario
			if (error.response && error.response.status === 401) 
                localStorage.removeItem('is_logged_in');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    // Login REAL
    const login = async (credentials: LoginCredentials) => { 
        try {
            setIsLoading(true);
            const userResponse = await authService.login(credentials);
            
            // userResponse es directamente el objeto User que devuelve Kevin
            localStorage.setItem('is_logged_in', 'true');
            
            // Sincronizamos el idioma inmediatamente tras el login
            syncLanguage(userResponse.language);
            
            setUser(userResponse);
        } catch (error) {
            console.error("Error login", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

	/* Register REAL */
	const register = async (credentials: RegisterCredentials) => { 
        try {
            setIsLoading(true);
            const userResponse = await authService.register(credentials);
			// Fortify auto-loguea tras el registro, así que activamos el flag para saber que el usuario ya está logueado y evitar errores en consola al recargar la página después de registrarse. Este flag no es seguro, pero ayuda a reducir las peticiones al backend y evita errores en consola.
            localStorage.setItem('is_logged_in', 'true');
            
            // Los registros nuevos suelen venir sin idioma o en inglés (EN)
            syncLanguage(userResponse.language);
            
            setUser(userResponse);
        } catch (error) {
            console.error("Error register", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout REAL
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Error logout", error);
        } finally {
            setUser(null);
            localStorage.removeItem('is_logged_in');
            // Opcional: resetear idioma a inglés al salir
            i18n.changeLanguage('en');
        }
    };

	/* El provider pasa el estado y las funciones de login/logout a los componentes hijos a través del contexto. */
    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated: !!user, 
            isLoading, 
            login,
			register,
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