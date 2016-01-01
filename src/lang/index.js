import * as languages from './languages.js';

function encodeText(text, param) {
  param.forEach((value, key) => {
    text = text.replace(new RegExp('\\$' + (key + 1), 'g'), value);
  });
  return text;
}

/* export const localeList = {
  en: 'English',
  ko: '한국어'
}; */

let CURRENT_LOCALE = languages['en'];

export function autoDetectLocale() {
  // Availability to use custom configuations.
  let browserLang = (window.localStorage && window.localStorage.language) ||
    navigator.language || navigator.userLanguage;
  for (let key in languages) {
    if (browserLang.slice(0, key.length) === key) {
      setLocale(key);
      return;
    }
  }
}

export function setLocale(lang = 'en') {
  CURRENT_LOCALE = languages[lang] || languages['en'];
}

export default function translate(key, ...params) {
  const translation = CURRENT_LOCALE[key] || 'ERR_' + key;
  return encodeText(translation, params);
}
