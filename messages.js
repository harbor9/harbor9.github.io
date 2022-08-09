const plConfig = {
    title: "Apartament Harbor 9 w Kołobrzegu",
    welcome: "Serdecznie Państwa zapraszamy do spędzenia urlopu w naszym apartamencie. Apartament Harbor 9 jest przestronnym, nowoczesnym mieszkaniem z ogromnym, narożnym balkonem oraz miejscem postojowym w podziemnym garażu. Stanowi wygodne miejsce do wypoczynku i relaksu, z możliwością dostawienia łóżeczka turystycznego dla małego dziecka (od 0 do 3 lat). Usytuowany jest niedaleko plaży zachodniej i pięknego tarasu widokowego, gdzie można podziwiać niezapomniane zachody słońca.",
    goodbye: "Zapraszamy do rezerwacji telefonicznej lub za pomocą formularza strony, bądź za pomocą stron booking.com lub airbnb"
}

const enConfig = {
    title: "Harbor 9 Apartment in Colberg",
    welcome: "Dear Guests, we would like to invite you to spend your holiday in our apartment, which has been designed in mind and is equipped for guest comfort. Moreover it has a huge corner balcony and a parking space in the underground garage. The location is close to the west beach and has the beautiful observation deck, where you can enjoy unforgettable sunsets. A holiday in Harbor 9 Apartment provides you a pleasant stay and plenty of opportunities for sea-side attractions.",
    goodbye: "Goodbye"
}

const deConfig = {
    title: "Harbor 9 Apartment in Colberg",
    welcome: "Liebe Gäste, wir möchten Sie einladen, Ihren Urlaub in unserer Wohnung zu verbringen, die auf Gästekomfort ausgelegt und ausgestattet ist. Unser Anwesen liegt in der Nähe des Weststrandes und der wunderschönen Aussichtsplattform, auf der Sie unvergessliche Sonnenuntergänge genießen können. Ein Urlaub im Harbor 9 Apartment bietet Ihnen einen angenehmen Aufenthalt und viele Möglichkeiten für Attraktionen am Meer.",
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
