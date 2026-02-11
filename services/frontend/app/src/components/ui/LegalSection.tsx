import { type ReactNode } from 'react';

interface LegalSectionProps {
  title: string;
  children: ReactNode;
}

const LegalSection = ({ title, children }: LegalSectionProps) => {
  return (
    <div className="mb-8">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
            {title}
        </h3>
        <div className="text-justify text-sm sm:text-base text-slate-300 leading-relaxed space-y-3 max-w-prose md:max-w-3xl">
            {children}
        </div>
    </div>
  );
};

export default LegalSection;