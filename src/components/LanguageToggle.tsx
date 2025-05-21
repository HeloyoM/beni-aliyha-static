import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageToggle = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'he' : 'en';
        i18n.changeLanguage(newLang);
        document.body.dir = newLang === 'he' ? 'rtl' : 'ltr'; // ⬅ RTL/LTR switch
    };

    return (
        <Languages onClick={toggleLanguage}>
            {i18n.language === 'en' ? 'עברית' : 'English'}
        </Languages>
    );
};

export default LanguageToggle;
