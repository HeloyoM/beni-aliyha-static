import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

const LanguageToggle = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'he' : 'en';
        i18n.changeLanguage(newLang);
        document.body.dir = newLang === 'he' ? 'rtl' : 'ltr'; // ⬅ RTL/LTR switch
    };

    return (
        <Button onClick={toggleLanguage} variant="outlined">
            {i18n.language === 'en' ? 'עברית' : 'English'}
        </Button>
    );
};

export default LanguageToggle;
