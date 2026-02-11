import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    /* Verifying cookie/session, show spinner or nothing  TODO */
    if (isLoading) {
        return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">Cargando...</div>; 
    }

    /* If loading finished and not authenticated, redirect to login */
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    /* If authenticated, render child routes (Outlet) */
    return <Outlet />;
};

export default ProtectedRoute;