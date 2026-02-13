import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import LanguageSelector from './LanguageSelector';
import { FaBars } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

const LandingNavbar = () => {
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="w-full h-24 bg-dark-900/95 backdrop-blur-md fixed top-0 z-50 transition-all duration-300 border-b border-white/5">
            <div className="w-full h-full flex justify-between items-center px-6 md:px-12">
                
                <Link to="/" className="flex items-center gap-3 group focus:outline-none select-none">
                    <Logo className="w-8 h-8" />
                    <span className="font-bold text-lg tracking-wide hidden md:block group-hover:text-brand-500 transition-colors">NEXUS NINE</span>
                </Link>

                <div className="hidden lg:flex items-center gap-6">
                    <LanguageSelector />
                    <div className="h-4 w-px bg-slate-700"></div>
                    <Link to="/" className="nav-link-desktop-active">{t('common.home')}</Link>
                    <span className="text-slate-600">|</span>
                    <Link to="/signin" className="nav-link-desktop">{t('common.login')}</Link>
                    <span className="text-slate-600">|</span>
                    <Link to="/signup" className="nav-link-desktop">{t('common.register')}</Link>
                </div>

                <button className="lg:hidden text-slate-300 hover:text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <FaXmark size={28} /> : <FaBars size={28} />}
                </button>
            </div>

            {isMenuOpen && (
                <div className="lg:hidden absolute top-24 left-0 w-full bg-dark-900 border-b border-white/10 p-4 flex flex-col gap-2 shadow-2xl animate-fade-in-down">
                    <Link to="/" className="nav-item-mobile-active" onClick={() => setIsMenuOpen(false)}>{t('common.home')}</Link>
                    <Link to="/signin" className="nav-item-mobile" onClick={() => setIsMenuOpen(false)}>{t('common.login')}</Link>
                    <Link to="/signup" className="nav-item-mobile" onClick={() => setIsMenuOpen(false)}>{t('common.register')}</Link>

                    <div className="border-t border-white/10 pt-4 mt-2 flex justify-center">
                        <LanguageSelector />
                    </div>
                </div>
            )}
        </nav>
    );
};

export default LandingNavbar;