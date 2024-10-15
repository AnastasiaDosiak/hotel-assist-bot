import i18next from "i18next";
import Backend from "i18next-fs-backend";
import path from "path";

export const initI18n = () => {
  i18next.use(Backend).init({
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: path.join(__dirname, "/locales/{{lng}}/translation.json"),
    },
  });
};
