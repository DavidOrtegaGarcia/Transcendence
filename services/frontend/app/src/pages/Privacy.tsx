import { useTranslation } from 'react-i18next';
import LegalLayout from '../components/layouts/LegalLayout';
import LegalSection from '../components/ui/LegalSection';

const Privacy = () => {
    const { t } = useTranslation();

    {/* Privacy Policy */}
    return (
        <LegalLayout title={`🔐 ${t('footer.privacy')}`}>
            
            <main className="mx-auto max-w-3xl text-left mb-18">

                {/* Section 1 */}
                <LegalSection title={`1. ${t('privacy.1')}`}>
                    <p>{t('privacy.1text')}</p>
                </LegalSection>

                {/* Section 2 */}
                <LegalSection title={`2. ${t('privacy.2')}`}>
                    <p>{t('privacy.2text')}</p>
                    <h4 className="text-base sm:text-lg md:text-xl font-semibold text-slate-300 mt-4 mb-2">
                        2.1 {t('privacy.21')}
                    </h4>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>{t('privacy.211')}</li>
                        <li>{t('privacy.212')}</li>
                        <li>{t('privacy.213')}</li>
                        <li>{t('privacy.214')}</li>
                    </ul>
                <h4 className="text-base sm:text-lg md:text-xl font-semibold text-slate-300 mt-4 mb-2">
                        2.2 {t('privacy.22')}
                    </h4>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>{t('privacy.221')}</li>
                        <li>{t('privacy.222')}</li>
                        <li>{t('privacy.223')}</li>
                    </ul>

                    <h4 className="text-base sm:text-lg md:text-xl font-semibold text-slate-300 mt-4 mb-2">
                        2.3 {t('privacy.23')}
                    </h4>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>{t('privacy.231')}</li>
                        <li>{t('privacy.232')}</li>
                        <li>{t('privacy.233')}</li>
                    </ul>
                </LegalSection>

                {/* Section 3 */}
                <LegalSection title={`3. ${t('privacy.3')}`}>
                    <p>{t('privacy.3text')}</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>{t('privacy.31')}</li>
                        <li>{t('privacy.32')}</li>
                        <li>{t('privacy.33')}</li>
                        <li>{t('privacy.34')}</li>
                        <li>{t('privacy.35')}</li>
                    </ul>
                    <p>{t('privacy.3text2')}</p>
                </LegalSection>

                {/* Section 4 */}
                <LegalSection title={`4. ${t('privacy.4')}`}>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>{t('privacy.41')}</li>
                        <li>{t('privacy.42')}</li>
                        <li>{t('privacy.43')}</li>
                    </ul>
                    <p>{t('privacy.4text')}</p>
                </LegalSection>

                {/* Section 5 */}
                <LegalSection title={`5. ${t('privacy.5')}`}>
                    <p>{t('privacy.5text')}</p>
                    <p>{t('privacy.5text2')}</p>
                </LegalSection>

                {/* Section 6 */}
                <LegalSection title={`6. ${t('privacy.6')}`}>
                    <p>{t('privacy.6text')}</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>{t('privacy.61')}</li>
                        <li>{t('privacy.62')}</li>
                        <li>{t('privacy.63')}</li>
                    </ul>
                    <p>{t('privacy.6text2')}</p>
                </LegalSection>

                {/* Section 7 */}
                <LegalSection title={`7. ${t('privacy.7')}`}>
                    <p>{t('privacy.7text')}</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>{t('privacy.71')}</li>
                        <li>{t('privacy.72')}</li>
                    </ul>
                    <p>{t('privacy.7text2')}</p>
                </LegalSection>

                {/* Section 8 */}
                <LegalSection title={`8. ${t('privacy.8')}`}>
                    <p>{t('privacy.8text')}</p>
                    <p>{t('privacy.8text2')}</p>
                </LegalSection>

                {/* Section 9 */}
                <LegalSection title={`9. ${t('privacy.9')}`}>
                    <p>{t('privacy.9text')}</p>
                </LegalSection>

            </main>
        </LegalLayout>
    );
};

export default Privacy;