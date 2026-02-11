import axios from 'axios';

/* To create instance with URL base from .env */ 
const api = axios.create({
	/* Base URL from environment variable or default to localhost */
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
	/* Accept send/recieve cookies */
    withCredentials: true,
    headers: {
		/* Common headers for all requests */
        'Content-Type': 'application/json',
		/* Required to identify API requests in Laravel */
        'Accept': 'application/json',
    }
});

/**
 * INFO IMPORTANTE
 * Axios automáticamente busca una cookie llamada 'XSRF-TOKEN'  y la pone en el header 'X-XSRF-TOKEN'. 
 * Sanctum usa exactamente estos nombres, usando axios standar no se necesita un interceptor manual 
 * para leer document.cookie y agregar el token a los headers, axios lo hace automáticamente.
 * Solo es necesario asegurarse de que el backend Laravel esté configurado para enviar la cookie 'XSRF-TOKEN' en las respuestas.
 * Esto se logra usando el middleware 'EnsureFrontendRequestsAreStateful' de Sanctum, que se encarga de establecer la cookie correctamente.
 * Si el backend está configurado correctamente, no es necesario ningún código adicional en el frontend para manejar CSRF, axios se encargará de todo automáticamente.
 * Si por alguna razón el backend no está enviando la cookie 'XSRF-TOKEN', entonces sí sería necesario implementar un interceptor manual en axios para leer la cookie y agregarla a los headers de las solicitudes. Pero en una configuración estándar con Laravel Sanctum, esto no es necesario.
 * En resumen, con una configuración estándar de Laravel Sanctum y axios, no es necesario ningún código adicional para manejar CSRF, ya que axios se encargará automáticamente de incluir el token CSRF en los headers de las solicitudes siempre que la cookie 'XSRF-TOKEN' esté presente.
 * CONSULTAR CON KEVIN
 */

export default api;