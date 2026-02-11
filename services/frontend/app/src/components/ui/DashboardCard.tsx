import React from 'react';

interface DashboardCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactElement;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
}

const DashboardCard = ({ title, subtitle, icon, onClick, variant = 'secondary' }: DashboardCardProps) => {
    
    /* Common Structure Styles */ 
    const baseStyles = "relative group flex items-center gap-4 lg:gap-6 p-3 md:p-6 rounded-2xl border transition-all duration-300 transform hover:scale-[1.02] cursor-pointer overflow-hidden";
    
    /* Styles based on variant (Refactored to CSS classes) */
    const variantStyles = variant === 'primary' 
        ? "card-primary-glow" 
        : "glass-panel glass-panel-hover";

    const iconColor = variant === 'primary' ? 'text-white' : 'text-brand-500';

    return (
        <button onClick={onClick} className={`${baseStyles} ${variantStyles} text-left w-full h-32 md:h-40`}>
            
            <div className={`p-3 ${iconColor} shrink-0 transition-transform group-hover:scale-110 duration-300`}>
                {React.cloneElement(icon as React.ReactElement<any>, { size: 50 })}
            </div>
            
            <div className="flex flex-col z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide font-sans">
                    {title}
                </h3>
                <p className={`text-sm md:text-base font-medium ${variant === 'primary' ? 'text-blue-100' : 'text-slate-400'}`}>
                    {subtitle}
                </p>
            </div>
        </button>
    );
};

export default DashboardCard;