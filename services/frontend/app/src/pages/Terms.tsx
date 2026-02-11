import { useTranslation } from 'react-i18next';
import LegalLayout from '../components/layouts/LegalLayout';
import LegalSection from '../components/ui/LegalSection';


const Terms = () => {
    const { t } = useTranslation();
    
    {/* Terms of Service */}
    return (
        /* Title with LegalLayout */
        <LegalLayout title={`📜 ${t('footer.terms')}`}>
            <main className="mx-auto max-w-3xl text-left mb-18">
                    
                {/* Section 1 */}
                <LegalSection title={`1. ${t('terms.1')}`}>
                    <p>{t('terms.1text1')}</p>
                    <p>{t('terms.1text2')}</p>
                </LegalSection>

                {/* Section 2 */}
                <LegalSection title={`2. ${t('terms.2')}`}>
                    <p>{t('terms.2text1')}</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>{t('terms.21')}</li>
                        <li>{t('terms.22')}</li>
                        <li>{t('terms.23')}</li>
                    </ul>
                    <p>{t('terms.2text2')}</p>
                </LegalSection>
                
                {/* Section 3 */}
                <LegalSection title={`3. ${t('terms.3')}`}>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>{t('terms.31')}</li>
                        <li>{t('terms.32')}</li>
                        <li>{t('terms.33')}</li>
                    </ul>
                </LegalSection>
                    {/* Section 4 */}
                <LegalSection title={`4. ${t('terms.4')}`}>
                    <p>{t('terms.4text1')}</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>{t('terms.41')}</li>
                        <li>{t('terms.42')}</li>
                        <li>{t('terms.43')}</li>
                        <li>{t('terms.44')}</li>
                        <li>{t('terms.45')}</li>
                        <li>{t('terms.46')}</li>
                    </ul>
                    <p>{t('terms.4text2')}</p>
                </LegalSection>
                
                {/* Section 5 */}
                <LegalSection title={`5. ${t('terms.5')}`}>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>{t('terms.51')}</li>
                        <li>{t('terms.52')}</li>
                        <li>{t('terms.53')}</li>
                    </ul>
                </LegalSection>
                
                {/* Section 6 */}
                <LegalSection title={`6. ${t('terms.6')}`}>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>{t('terms.61')}</li>
                        <li>{t('terms.62')}</li>
                        <li>{t('terms.63')}</li>
                    </ul>
                </LegalSection>
                    {/* Section 7 */}
                <LegalSection title={`7. ${t('terms.7')}`}>
                    <p>{t('terms.7text1')}</p>
                    <p>{t('terms.7text2')}</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>{t('terms.71')}</li>
                        <li>{t('terms.72')}</li>
                        <li>{t('terms.73')}</li>
                    </ul>
                    
                </LegalSection>
                    {/* Section 8 */}
                <LegalSection title={`8. ${t('terms.8')}`}>
                    <p>{t('terms.8text1')}</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>{t('terms.81')}</li>
                        <li>{t('terms.82')}</li>
                    </ul>
                    <p>{t('terms.8text2')}</p>
                </LegalSection>
                
                {/* Section 9 */}
                <LegalSection title={`9. ${t('terms.9')}`}>
                    <p>{t('terms.9text')}</p>
                </LegalSection>
                    {/* Section 10 */}
                <LegalSection title={`10. ${t('terms.10')}`}>
                    <p>{t('terms.10text')}</p>
                </LegalSection>
            </main>
        </LegalLayout>
    );
};

export default Terms;