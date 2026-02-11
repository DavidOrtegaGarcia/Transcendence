import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';
import Footer from '../Footer';
import { FaXmark } from "react-icons/fa6";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 relative px-6 overflow-hidden">
      {/* Container */}
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 bg-dark-800/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]">
        
        { /*Close button */}
        <Link 
          to="/" 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                <FaXmark  />
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 mb-4 hover:scale-110 transition-transform" title="Back to LandingPage">
             <Logo />
          </Link>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            {subtitle}
          </p>
        </div>

        {children}
      </div>

      <Footer className="w-full mt-8 absolute bottom-0" />
    </div>
  );
};

export default AuthLayout;