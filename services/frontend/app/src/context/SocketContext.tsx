import React, { createContext, useContext, useEffect, useState } from 'react';
import echo from '../utils/echo';
import Echo from 'laravel-echo';
import { useAuth } from './AuthContext';

const SocketContext = createContext<Echo<any> | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated, user } = useAuth();
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		/* Retrieve tokens stored by authService.getUser() during login/checkSession */
		const token = sessionStorage.getItem('unity_auth_token');
		const userId = sessionStorage.getItem('unity_user_id');

		/* Check if the Echo instance has a valid Pusher connector and connection before proceeding. */
		const connector = echo.connector.pusher;
		if (!connector || !connector.connection) return;

		/* We only connect if the user is authenticated and we have the necessary Unity tokens */
		if (isAuthenticated && user && token && userId) {

			/* Ensure the Echo instance uses the latest token from this session. */
			echo.options.auth = {
				...echo.options.auth,
				headers: {
					...(echo.options.auth?.headers || {}),
					Authorization: `Bearer ${token}`
				}
			};

			console.log(`[SocketContext] Echo ready for user: ${userId}`);

			/* If the connection is currently disconnected, we attempt to connect. This handles cases where the user logs in after the component has mounted. */
			if (connector.connection.state === 'disconnected') {
				echo.connector.connect();
			}

			/* Implementation of the friend status listener:We subscribe to OUR own channel (because friends notify us there) */
			const channel = echo.private(`user.${userId}`);

			/* Listen for friend status changes (online/offline) */
			channel.listen('.UserStatusChanged', (data: { userId: number, newStatus: string }) => {
				console.log(`Reverb: El amigo ${data.userId} ha cambiado a ${data.newStatus}`);

				/* Throw event to the entire React window */
				window.dispatchEvent(new CustomEvent('friendStatusChanged', {
					detail: { userId: data.userId, newStatus: data.newStatus }
				}));
			});

			/* Listen for incoming friend requests */
			channel.listen('.FriendRequestReceived', (_data: any) => {
				console.log(`Reverb: ¡Petición de amistad recibida!`);

				/* Throw event to the entire React window to show red badge notification */
				window.dispatchEvent(new CustomEvent('friendRequestReceived'));
				window.dispatchEvent(new Event('updateFriendNotifications'));
			});

			/* Listen for friend request accepted events */
			channel.listen('.FriendRequestAccepted', (_data: any) => {
				console.log(`Reverb: ¡Alguien aceptó tu petición de amistad!`);

				/* Throw event to the entire React window to show red badge notification */
				window.dispatchEvent(new Event('updateFriendNotifications'));
			});

			/* Listen for friendship removed events */
			channel.listen('.FriendshipRemoved', (data: { userId: number }) => {
				window.dispatchEvent(new CustomEvent('friendshipRemoved', {
					detail: { userId: data.userId }
				}));
			});

			/* Listen for friend requests SENT by the current user (To update UI in other tabs/pages) */
			channel.listen('.FriendRequestSent', (_data: any) => {
				window.dispatchEvent(new Event('updateFriendNotifications'));
			});

			setIsReady(true);

			/* Cleanup: If the component unmounts or deps change */
			return () => {
				/* We check the connection state before trying to leave or disconnect to avoid errors. */
				const state = connector.connection.state;
				/* We only disconnect if we're currently connected or in the process of connecting, and the user is no longer authenticated. This prevents unnecessary disconnects if the user is still logged in. */
				if (state === 'connected') {
					echo.leave(`user.${userId}`);
					if (!isAuthenticated) {
						echo.disconnect();
						setIsReady(false);
					}
					/* If we're in the process of connecting but the user is not authenticated, we set a timeout to check the connection state shortly after. If it has connected by then, we disconnect immediately. This handles edge cases where the connection might succeed just as the user logs out. */
				} else if (state === 'connecting' && !isAuthenticated) {
					setTimeout(() => {
						if (connector.connection.state === 'connected' && !isAuthenticated) {
							echo.disconnect();
						}
					}, 500);
				}
			};
		}
	}, [isAuthenticated, user]);

	return (
		// Provide the echo instance only when the connection is established and ready 
		<SocketContext.Provider value={isReady ? echo : null}>
			{children}
		</SocketContext.Provider>
	);
};

/** Custom hook to access the global Echo instance. Returns null if the socket is not connected or the user is not authenticated.*/
export const useSocket = () => useContext(SocketContext);