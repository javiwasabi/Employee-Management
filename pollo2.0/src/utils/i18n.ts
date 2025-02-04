import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "../translations/en/global.json";
import es from "../translations/es/global.json";

const i18nConfig: InitOptions = {
  fallbackLng: "en", // Idioma predeterminado
  debug: true,
  detection: {
    order: ["queryString", "cookie"],
    caches: ["cookie"],
  },
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: en, 
    es: es, 
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(i18nConfig);

export default i18n;
