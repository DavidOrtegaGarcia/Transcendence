import api from './api';
import type { LoginCredentials, RegisterCredentials, User } from '../context/Auth';


const authService = {
    /**
     * Necesito obtener la cookie CSRF. 
     * Kevin me dice: await fetch(".../sanctum/csrf-cookie", {method: "GET"});
     */
    getCsrfToken: async (): Promise<void> => {
        await api.get('/sanctum/csrf-cookie'); 
    },

    /**
     * Para hacer Login
     * Primero pedimos la cookie, luego enviamos credenciales.
     */
    login: async (creds: LoginCredentials): Promise<User> => {

		// ---------------------------------------------------------
        //  MODO MOCK (DESARROLLO SIN BACKEND)
        // ---------------------------------------------------------
        // console.warn("⚠️ MODO MOCK ACTIVADO: Simulando login...");
        // return new Promise((resolve) => {
        //     setTimeout(() => {
        //         // Devolvemos un usuario falso tras 1 segundo
        //         resolve({ 
        //             id: '1', 
        //             username: 'MiriamMock', 
        //             email: creds.email, 
        //             avatar: '/assets/avatars/sorceress.png' 
        //         });
        //     }, 1000);
        // });

		// ---------------------------------------------------------
        //  CÓDIGO REAL (COMENTADO HASTA TENER BACKEND)
        // ---------------------------------------------------------
        
        await authService.getCsrfToken(); // El handshake de seguridad
        await api.post('/login', creds); // Sanctum crea la sesión en el backend
        return authService.getUser(); // Obtenemos el usuario recién logueado
        
    },
	
    /**
     * Para Register
     */
    register: async (data: RegisterCredentials): Promise<User> => {

		// // MODO MOCK
        // console.warn("⚠️ MODO MOCK ACTIVADO: Simulando registro...");
        // return new Promise((resolve) => {
        //     setTimeout(() => {
        //         resolve({ 
        //             id: '2', 
        //             username: data.username, 
        //             email: data.email, 
        //             avatar: '' 
        //         });
        //     }, 1000);
        // });

        // CÓDIGO REAL
        
        await authService.getCsrfToken();
        await api.post('/register', data); // Fortify suele loguear automáticamente tras registro
        return authService.getUser();
		
    },

    /**
     * Para Logout
     */
    logout: async (): Promise<void> => {
        // // MODO MOCK
        // console.warn("⚠️ MODO MOCK ACTIVADO: Simulando logout...");
        // return new Promise((resolve) => {
        //     setTimeout(() => resolve(), 500);
        // });

        // CÓDIGO REAL
        
        await api.post('/logout');
        
    },

    /**
     * Para obtener usuario actual (Check Session)
     * Laravel suele exponer esto en /api/user
     */
    getUser: async (): Promise<User> => {
        // // 🚧 MODO MOCK
        // // Simulamos que SIEMPRE hay un usuario logueado al recargar
        // // Si quieres probar el estado "deslogueado", comenta esto y lanza un error
        // console.warn("⚠️ MODO MOCK ACTIVADO: Recuperando usuario simulado...");
        // return new Promise((resolve) => {
        //     setTimeout(() => {
        //         resolve({ 
        //             id: '1', 
        //             username: 'MiriamMock', 
        //             email: 'test@mock.com', 
        //             avatar: '/assets/avatars/sorceress.png' 
        //         });
        //     }, 500);
        // });

        // 🚀 CÓDIGO REAL
        
        const { data } = await api.get('/user');
        return data;
       
    }
};

export default authService;