export const LANG_KEY = "lang";

export const getSavedLanguagePreference = () => {
  return localStorage.getItem(LANG_KEY) || "en";
};

export const saveLanguagePreference = (val) => {
  return localStorage.setItem(LANG_KEY, val);
};
