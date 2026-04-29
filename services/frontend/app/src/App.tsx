import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Index from './pages/Index';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './pages/ResetPassword';
import Friends from './pages/Friends';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Ranking from './pages/Ranking';
import Error from './pages/Error';
import Lobby from './pages/Lobby';
import Collection from './pages/Collection';
import Game from './pages/Game';

// Import necessary for the "force offline" mechanism when the user closes the tab or browser
import { useEffect } from 'react';
import authService from './services/authService';
import { FriendsProvider } from './context/FriendsContext';

function App() {

	// Force offline when the user closes the tab or browser
	useEffect(() => {
		const handleTabClose = () => {
			if (sessionStorage.getItem('unity_user_id')) {
				authService.forceOffline();
			}
		};

		window.addEventListener('beforeunload', handleTabClose);

		return () => {
			window.removeEventListener('beforeunload', handleTabClose);
		};
	}, []);


	return (
		<AuthProvider>
			<FriendsProvider>
				<Router>
					<SocketProvider>
						<Routes>
							{/* ------ PUBLIC ROUTES ------ */}
							{/* Main Route to show Landing Page */}
							<Route path="/" element={<Landing />} />

							{/* Route to Login */}
							<Route path="/signin" element={<Login />} />

							{/* Route to Register */}
							<Route path="/signup" element={<Register />} />

							{/* Route to Password Reset */}
							<Route path="/reset_password" element={<ResetPassword />} />

							{/* Route to Privacy Policy */}
							<Route path="/privacy_policy" element={<Privacy />} />

							{/* Route to Terms of Service */}
							<Route path="/terms_of_service" element={<Terms />} />

							{/* ------ ERROR ROUTES ------ */}

							{/* Specific route from backend */}
							<Route path="/error" element={<Error />} />


							{/* ------ PRIVATE ROUTES ------ */}
							<Route element={<ProtectedRoute />}>
								<Route path="/index" element={<Index />} />
								<Route path="/friends" element={<Friends />} />
								{/*Route to profile without parameters */}
								<Route path="/profile" element={<Profile />} />

								{/* Route to view OTHERS (the :id is the variable) */}
								<Route path="/profile/:id" element={<Profile />} />
								<Route path="/edit_profile" element={<EditProfile />} />
								<Route path="/ranking" element={<Ranking />} />
								<Route path="/collection" element={<Collection />} />
								{/* Route to Lobby with query parameters for mode and submode (ej: /lobby?mode=casual&submode=limited) */}
								<Route path="/lobby" element={<Lobby />} />
								{/* Route to Game with matchId parameter (ej: /game/123) */}
								<Route path="/game/:matchId" element={<Game />} />

								{/* <Route path="/collection" element={<Collection />} /> */}
							</Route>

							{/* Avoid Laravel routes */}
							<Route path="/login" element={<Navigate to="/signin" replace />} />
							<Route path="/register" element={<Navigate to="/signup" replace />} />
							<Route path="/password/reset" element={<Navigate to="/reset_password" replace />} />
							<Route path="/password/email" element={<Navigate to="/reset_password" replace />} />
							<Route path="/password/update" element={<Navigate to="/reset_password" replace />} />
							<Route path="/password/reset/:token" element={<Navigate to="/reset_password" replace />} />

							{/* Catch-all route for undefined paths */}
							<Route path="*" element={<Error />} />

						</Routes>
					</SocketProvider>
				</Router>
			</FriendsProvider>
		</AuthProvider>
	)
}

export default App;