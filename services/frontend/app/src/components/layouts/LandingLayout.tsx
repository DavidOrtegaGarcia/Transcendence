import { type ReactNode } from 'react';
import LandingNavbar from '../LandingNavbar';
import Footer from '../Footer';

interface LandingLayoutProps {
    children: ReactNode;
}

const LandingLayout = ({ children }: LandingLayoutProps) => {
    return (
        <div className="min-h-screen w-full bg-dark-900 text-white font-sans overflow-hidden flex flex-col relative">
            
            <LandingNavbar />

            <main className="flex-1 flex flex-col relative z-10 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LandingLayout;