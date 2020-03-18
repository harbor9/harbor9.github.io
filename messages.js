const plConfig = {
    welcome: "Witamy",
    title: "To jest strona Apartamentu Harbor9!",
    goodbye: "Zegnamy"
}

const enConfig = {
    welcome: "Welcome",
    title: "This is the website of the Harbor9 Apartment!",
    goodbye: "Goodbye"
}

const deConfig = {
    welcome: "Willkommen",
    title: "Die ist die Website der Ferienwohnung Harbor9!",
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