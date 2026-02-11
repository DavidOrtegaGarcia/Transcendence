import { type ReactNode } from 'react';
import Footer from '../Footer';
import LandingNavbar from '../LandingNavbar';

interface LegalLayoutProps {
  children: ReactNode;
  title: string;
}

const LegalLayout = ({ children, title }: LegalLayoutProps) => {
  return (
    <div className="min-h-screen bg-dark-900 text-white font-sans flex flex-col overflow-x-hidden">
        <LandingNavbar />
        
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 pb-10 mt-24">
            <div className="mx-auto max-w-3xl text-left">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                    {title}
                </h2>
                {children}
            </div>
        </main>

        <Footer />
    </div>
  );
};

export default LegalLayout;