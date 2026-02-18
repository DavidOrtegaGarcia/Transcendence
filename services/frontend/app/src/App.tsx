import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
	return (
		<AuthProvider>
			<Router>
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
                        {/* Aquí irán /game, /chat, etc. */}
                    </Route>

					{/* Catch-all route for undefined paths */}
		            <Route path="*" element={<Error />} />

				</Routes>
			</Router>
		</AuthProvider>
	)
}

export default App;