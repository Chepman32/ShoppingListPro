import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en.json';
import ru from './translations/ru.json';
import sp from './translations/sp.json';
import de from './translations/de.json';
import fr from './translations/fr.json';
import por from './translations/por.json';
import jp from './translations/jp.json';
import ch from './translations/ch.json';
import ko from './translations/ko.json';
import ua from './translations/ua.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    sp: { translation: sp },
    de: { translation: de },
    fr: { translation: fr },
    por: { translation: por },
    jp: { translation: jp },
    ch: { translation: ch },
    ko: { translation: ko },
    ua: { translation: ua },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
