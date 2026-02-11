// import React from 'react';
import { useTranslation } from 'react-i18next';
import {Link} from 'react-router-dom';

interface FooterProps {
    className?: string;
}

const Footer = ({ className = "" }: FooterProps) => {
    const { t } = useTranslation();

    return (
        <footer className={`fixed bottom-0 left-0 w-full realtive py-6 text-center text-xs md:text-sm text-slate-600  bg-darker z-40 ${className}`}>
        

            <div className="relative z-20">
                <Link
                        to="/privacy_policy"
                        className="inline-flex items-center justify-center hover:text-brand-600 transition-colors"
                        title= {t('footer.privacy')}
                >
                {t('footer.privacy')} </Link>
                { "  |  " }
                <Link
                        to="/terms_of_service"
                        className="inline-flex items-center justify-center hover:text-brand-600 transition-colors"
                        title={t('footer.terms')}
                >{t('footer.terms')} </Link>
                 
            </div>
        </footer>
    );
};

export default Footer;