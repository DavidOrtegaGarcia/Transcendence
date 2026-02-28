import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaBars } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import Logo from './Logo';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '../context/AuthContext';
import i18n from '../i18n';

const Navbar = () => {
	const { t } = useTranslation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const url = useLocation();

	/* Hooks to redirect and context */
    const navigate = useNavigate(); 
    const { logout } = useAuth();

	const getDesktopClass = (path: string) =>
		url.pathname === path ? "nav-link-desktop-active" : "nav-link-desktop";

	const getMobileClass = (path: string) =>
		url.pathname === path ? "nav-item-mobile-active" : "nav-item-mobile";

	const handleLogout = async (closeMenu: boolean) => {
		/* Close menu if is mobile */
		if (closeMenu) setIsMenuOpen(false);

		 /* Clear localStorage (language preference) */
		localStorage.removeItem('lang');
		i18n.changeLanguage('en');
		
		/* Redirect to home (landing page)*/
		navigate('/');
		
		/* Wait for response from backend to complete logout cleaning session and changing state  */
		await logout();		
	}

	return (
		<nav className="w-full h-24 bg-dark-900/95 backdrop-blur-md fixed top-0 z-50 transition-all duration-300 border-b border-white/5">
			<div className="w-full h-full flex justify-between items-center px-6 md:px-12">

				{/* Logo */}
				<Link to="/index" className="flex items-center gap-3 group focus:outline-none select-none">
					<div className="p-1.5 bg-dark-800/50 rounded-lg border border-white/10 group-hover:border-brand-500/50 transition-colors">
						<Logo className="w-8 h-8" />
					</div>
					<span className="font-bold text-lg tracking-wider hidden md:block">NEXUS NINE</span>
				</Link>

				{/* Desktop Menu */}
				<div className="hidden lg:flex items-center gap-8">
					<Link to="/index" className={getDesktopClass("/index")}>{t('navbar.dashboard')}</Link>

					<Link to="/friends" className={getDesktopClass("/friends")}>
						{t('navbar.friends')}
					</Link>

					<Link to="/profile" className={getDesktopClass("/profile")}>
						{t('navbar.profile')}
					</Link>

					<Link to="/ranking" className={`flex items-center gap-2 ${getDesktopClass("/ranking")}`}>
						{t('navbar.ranking')}
					</Link>

					<Link to="/collection" className={`flex items-center gap-2 ${getDesktopClass("/collection")}`}>
						{t('navbar.collection')}
					</Link>

					<div className="h-6 w-px bg-white/10 mx-2"></div>

					<div className="flex items-center gap-4">
						<LanguageSelector />
						<button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-danger transition-all text-sm font-medium group" onClick={() => handleLogout(false)}>
							<MdLogout className="group-hover:-translate-x-1 transition-transform" />
							{t('navbar.logout')}
						</button>
					</div>
				</div>

				{/* Mobile Toggle */}
				<button className="lg:hidden text-slate-300 hover:text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
					{isMenuOpen ? <FaXmark size={28} /> : <FaBars size={28} />}
				</button>
			</div>

			{/* Mobile Overlay */}
			{isMenuOpen && (
				<div className="lg:hidden absolute top-24 left-0 w-full bg-dark-900 border-b border-white/10 p-4 flex flex-col gap-2 shadow-2xl animate-fade-in-down">
					<Link to="/index" className={getMobileClass("/index")} onClick={() => setIsMenuOpen(false)}>{t('navbar.dashboard')}</Link>
					<Link to="/ranking" className={getMobileClass("/ranking")} onClick={() => setIsMenuOpen(false)}>{t('navbar.ranking')}</Link>
					<Link to="/friends" className={getMobileClass("/friends")} onClick={() => setIsMenuOpen(false)}>{t('navbar.friends')}</Link>
					<Link to="/chat" className={getMobileClass("/chat")} onClick={() => setIsMenuOpen(false)}>{t('navbar.chat')}</Link>
					<Link to="/profile" className={getMobileClass("/profile")} onClick={() => setIsMenuOpen(false)}>{t('navbar.profile')}</Link>

					<div className="h-px bg-white/10 my-2"></div>

					<button className="p-3 w-full text-center text-danger hover:bg-danger/10 rounded-lg flex items-center justify-center gap-2 transition-colors" onClick={() => handleLogout(true)}>
						<MdLogout /> {t('navbar.logout')}
					</button>

					<div className="border-t border-white/10 pt-4 mt-2 flex justify-center">
						<LanguageSelector />
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;