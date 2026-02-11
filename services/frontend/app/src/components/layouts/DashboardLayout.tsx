import { type ReactNode, } from 'react';
import Footer from '../Footer';
import Navbar from '../Navbar';

interface DashboardLayoutProps {
    children: ReactNode;
    isCentered?: boolean;
}

const DashboardLayout = ({ children, isCentered = false }: DashboardLayoutProps) => {
    return (
        <div className={`
            min-h-screen w-full bg-dark-900 text-white font-sans overflow-hidden flex flex-col relative
            pt-30            
            ${isCentered ? 'md:pt-0' : 'md:pt-30'}
        `}>

            <Navbar />

            {/* Main Content */}
            <main className={`flex-1 px-6 sm:px-6 relative z-10 flex flex-col 
                ${isCentered ? 'min-h-screen' : 'min-h-[calc(100vh-112px)]'}
                
                ${isCentered 
                    /* Mobile: Up / Desktop: Center */
                    ? 'justify-start md:justify-center items-center' 
                    /* Always Up (Friends, Profile...) */
                    : 'justify-start items-stretch'                  
                }
            `}>
                <div className="max-w-5xl mx-auto w-full">
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DashboardLayout;