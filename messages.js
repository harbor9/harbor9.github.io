const plConfig = {
    welcome: "Witamy",
    title: "Apartament Harbor 9 w Kołobrzegu",
    goodbye: "Żegnamy"
}

const enConfig = {
    welcome: "Welcome",
    title: "Harbor 9 Apartment in Colberg",
    goodbye: "Goodbye"
}

const deConfig = {
    welcome: "Herzlich Willkommen",
    title: "Harbor 9 Apartment in Colberg",
    goodbye: "Auf Wiedersehen "
}

var browserLanguage = (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;

const replaceText = (el) => {
    const key = el.innerText;
    if (browserLanguage.toLowerCase().startsWith("pl")) {
        el.innerText = plConfig[key] || key;
    } else if (browserLanguage.toLowerCase().startsWith("de")) {
        el.innerText = deConfig[key] || key;
    } else {
        el.innerText = enConfig[key] || key;
    }
}

const elements = document.querySelectorAll("[data-i18n]");
elements.forEach(el => replaceText(el));
