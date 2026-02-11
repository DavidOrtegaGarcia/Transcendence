import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enJSON from './local/en.json';
import esJSON from './local/es.json';
import caJSON from './local/ca.json';

/* Read language on LocalStorage if available, if is not, use 'en' as default */
const savedLanguage = localStorage.getItem('lang') || 'en';

i18n.use(initReactI18next).init({
	resources: {
		en: { translation: enJSON },
		es: { translation: esJSON },
		ca: { translation: caJSON },
	},
	lng: savedLanguage,
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;