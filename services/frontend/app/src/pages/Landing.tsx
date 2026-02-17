import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import LandingLayout from '../components/layouts/LandingLayout';
import LandingNavbar from '../components/LandingNavbar';
import Separator from '../components/Separator';

const Landing = () => {
    const { t } = useTranslation();

    return (
        /* Main Container */
        <LandingLayout>

            {/* Decorative Element */}
            <Separator />

            {/* Landing Navbar */}
            <LandingNavbar />

            {/* Main Content */}
            <section className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 w-full">
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                    {/* Title Group */}
                    <div className="mb-6 space-y-2 text-center">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]">
                            NEXUS NINE
                        </h1>
                        {/* Changed bg-linear-to-b to bg-gradient-to-b */}
                        <h2 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-slate-400">
                            CARD GAME
                        </h2>
                    </div>

                    {/* Subtítulo */}
                    <p className="text-slate-400 text-base md:text-xl max-w-sm md:max-w-2xl mb-8 leading-relaxed text-center px-2">
                        {t('landing.subtitle')}
                    </p>

                    {/* Botón CTA */}
                    <Link to="/signin" className="group relative inline-block">
                        <div className="absolute -inset-1 bg-brand-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-200"></div>
                        <button className="relative w-full md:w-auto px-10 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg rounded-full transition-all transform hover:scale-105 shadow-xl">
                            {t('landing.start')}
                        </button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <div className="relative z-20">
                <Footer />
            </div>
        </LandingLayout>
    );
};

export default Landing;