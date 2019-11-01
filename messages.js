const plConfig = {
    welcome: "ponizej",
    hi: "powyzej"
}

const replaceText = (el) => {
    const key = el.innerText;
    el.innerText = plConfig[key] || key;
}

const elements = document.querySelectorAll("[data-i18n]");
console.log(elements);
elements.forEach(el => replaceText(el));