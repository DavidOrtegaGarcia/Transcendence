import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { FaRobot, FaUserSecret, FaTimes, FaCircleNotch, FaTrophy, FaUsers } from 'react-icons/fa';

const Lobby = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const mode = searchParams.get('mode') || 'unknown';
    const submode = searchParams.get('submode');

    const [isMatchFound, setIsMatchFound] = useState(false);

    // Determinar el título y el icono según el modo seleccionado
    const getModeDetails = () => {
        if (mode === 'campaign') return { title: 'Campaign PVE', icon: <FaRobot className="text-brand-500 text-4xl mb-2" /> };
        if (mode === 'ranked') return { title: 'Ranked Match (4 pts Limit)', icon: <FaTrophy className="text-warning text-4xl mb-2" /> };
        if (mode === 'casual') return { 
            title: `Casual Match (${submode === 'limited' ? 'Limited 4 pts' : 'Unlimited'})`, 
            icon: <FaUsers className="text-brand-500 text-4xl mb-2" /> 
        };
        return { title: 'Unknown Mode', icon: null };
    };

    const { title, icon } = getModeDetails();
    const isPvE = mode === 'campaign';

    // Simulación de Matchmaking o Carga de Unity
    useEffect(() => {
        // Aqui debo conectarme al WebSocket del backend para buscar partida.
        // Mientras no lo puedo implementar hago simulacion de que encuentro partida o juego contra la IA con un delay de 4 segundos.
        const timer = setTimeout(() => {
            setIsMatchFound(true);
            
            // Tras la espera redirijo a la vista donde Unity debe ser ejecutado
            setTimeout(() => {
				// Comentado hasta que no esté integrado Unity en el proyecto
                // navigate('/game');

                console.log("Redirigiendo a Unity...");
            }, 2000);

        }, 4000);

        return () => clearTimeout(timer);
    }, [mode, navigate]);

    const handleCancel = () => {
        // Aquí avisaríamos al backend de que cancelamos la búsqueda antes de salir
        navigate('/index');
    };

    return (
        <DashboardLayout isCentered={true}>
            <div className="max-w-3xl w-full mx-auto animate-fade-in-up">
                
                {/* Lobby Header */}
                <div className="text-center mb-10">
                    <div className="flex justify-center">{icon}</div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">{title}</h1>
                    <p className="text-slate-400">
                        {isMatchFound 
                            ? "¡Partida lista! Preparando el tablero..." 
                            : isPvE ? "Cargando entorno de simulación..." : "Buscando oponente de tu nivel..."}
                    </p>
                </div>

                {/* Versus zone (VS) */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12 relative">
                    
                    {/* Player (You) */}
                    <div className="glass-panel p-6 flex flex-col items-center w-48 relative z-10 border-brand-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                        <div className="w-20 h-20 rounded-full bg-brand-500/20 flex items-center justify-center border-2 border-brand-500 mb-4 overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold text-brand-500">{user?.username?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-white text-center w-full truncate">{user?.username || 'Player'}</h3>
                        <span className="text-xs text-brand-400 font-medium bg-brand-500/10 px-3 py-1 rounded-full mt-2">Ready</span>
                    </div>

                    {/* VS Animation */}
                    <div className="flex flex-col items-center justify-center z-10">
                        <div className="w-16 h-16 rounded-full bg-dark-900 border border-white/10 flex items-center justify-center shadow-lg relative">
                            {/* Rings while searching game */}
                            {!isMatchFound && (
                                <>
                                    <div className="absolute inset-0 rounded-full border border-brand-500/50 animate-ping opacity-75"></div>
                                    <div className="absolute -inset-4 rounded-full border border-brand-500/20 animate-ping opacity-50" style={{ animationDelay: '0.2s' }}></div>
                                </>
                            )}
                            <span className={`font-black italic text-xl ${isMatchFound ? 'text-brand-500' : 'text-slate-500'}`}>VS</span>
                        </div>
                    </div>

                    {/* Opponent */}
                    <div className={`glass-panel p-6 flex flex-col items-center w-48 relative z-10 transition-all duration-500 ${isMatchFound ? 'border-danger/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-white/5 opacity-70'}`}>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 mb-4 overflow-hidden transition-all duration-500
                            ${isMatchFound 
                                ? 'bg-danger/20 border-danger text-danger' 
                                : 'bg-dark-900 border-white/10 text-slate-600'}`}
                        >
                            {isMatchFound && isPvE ? (
                                <FaRobot size={32} />
                            ) : isMatchFound && !isPvE ? (
                                <FaUserSecret size={32} /> // Aquí iría el avatar del rival real
                            ) : (
                                <FaCircleNotch className="animate-spin" size={28} />
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-white text-center w-full truncate">
                            {isMatchFound && isPvE ? 'Nexus AI' 
                            : isMatchFound && !isPvE ? 'Rival Encontrado' 
                            : 'Searching...'}
                        </h3>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full mt-2 transition-colors duration-500
                            ${isMatchFound ? 'bg-danger/10 text-danger' : 'bg-white/5 text-slate-500'}`}>
                            {isMatchFound ? 'Ready' : 'Waiting'}
                        </span>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                    <button 
                        onClick={handleCancel}
                        disabled={isMatchFound}
                        className={`btn-icon px-8 py-3 font-bold rounded-xl transition-all duration-300 flex items-center gap-2
                            ${isMatchFound 
                                ? 'bg-success/20 text-success border border-success/50 cursor-not-allowed' 
                                : 'bg-dark-900 border border-danger/50 text-danger hover:bg-danger hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]'}`}
                    >
                        {isMatchFound ? (
                            <>Preparando el Tablero...</>
                        ) : (
                            <>
                                <FaTimes />
                                {t('common.cancel', 'Cancelar Búsqueda')}
                            </>
                        )}
                    </button>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default Lobby;