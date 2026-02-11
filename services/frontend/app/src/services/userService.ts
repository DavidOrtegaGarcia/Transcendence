// src/services/userService.ts
import api from './api';
import type { User } from '../context/Auth';

/* Este servicio se encargará de las operaciones relacionadas con el usuario, como obtener su perfil, actualizarlo, etc. */
export interface UpdateProfilePayload {
    username: string;
    bio?: string;
    language?: string;
    password?: string;
    avatar?: string;
}

/* Por ahora solo implementaremos un método de ejemplo para obtener el perfil del usuario, pero se pueden añadir más métodos según las necesidades de la aplicación. */
const userService = {
    // Ejemplo de método real
    getProfile: async (): Promise<User> => {
        const response = await api.get('/api/user');
        return response.data;
    },
    
    // Puedes dejar un placeholder si no tienes la ruta aún
    consoleLog: () => {
        console.log("Servicio de usuario listo");
    }
};

export default userService;