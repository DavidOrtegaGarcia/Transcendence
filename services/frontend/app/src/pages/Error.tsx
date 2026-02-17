import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaExclamationTriangle} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Error = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
	const { isAuthenticated } = useAuth();

	/* Redirige al usuario a la página de inicio si hace clic en el botón */
		const handleClick = () => {
			if (isAuthenticated) {
				console.log(isAuthenticated);
				navigate('/index');
			}
			else 
				navigate('/');
	};

    return (
        <div className="min-h-screen w-full bg-dark-900 text-white font-sans overflow-hidden flex flex-col relative justify-center items-center px-4">
            <div className="flex flex-col items-center justify-center px-4 relative z-10 w-full text-center">
                
                {/* Icono Grande Animado */}
                <div className="mb-6 animate-bounce-slow">
                    <FaExclamationTriangle className="text-8xl text-danger drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                </div>

                {/* Título Glitch / Grande */}
                <h1 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tighter mb-4">
                    404
                </h1>

                {/* Mensaje de Error */}
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                    {t('error.title')}
                </h2>
                
                <p className="text-slate-400 text-lg max-w-md mx-auto mb-10">
                    {t('error.subtitle') }
                </p>

                {/* Botones de Acción */}
                <div className="flex flex-col md:flex-row gap-4">
                    <button 
                        onClick={() => handleClick()} 
                        className="btn-primary px-10 py-3 rounded-full font-bold shadow-lg shadow-brand-500/20"
                    >
                        {t('common.home') || "Ir al Inicio"}
                    </button>
                </div>

                {/* Código de error técnico (Decorativo) */}
                <div className="mt-12 text-xs font-mono text-slate-600 border-t border-white/5 pt-4">
                    ERROR_CODE: SECTOR_NOT_FOUND // PROTOCOL_MISSING
                </div>
            </div>
        </div>
    );
};

export default Error;