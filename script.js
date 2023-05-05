// display none element transitionned after and of transition
const logoTransition = document.querySelector(".logo-transition");
logoTransition.addEventListener("animationend", function () {
    logoTransition.style.display = "none";
});

// normalize() convert string to normalize Unicode format   +  replace for replace by empty string special caracters
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// function geoLocalisation
function getMyPosition() {
    navigator.geolocation.getCurrentPosition(async function (position) {    //navigator Objet contenant ttes les infos de l user / Geolocation obtenir la geoloc/ GetCurrentPosition Methode demande la position de l appareil de l'user et traite le retour.
        console.log("Position trouvée : Latitude=" + position.coords.latitude + " Longitude=" + position.coords.longitude);
        btnGeo.dataset.geoLoc = `${position.coords.latitude}, ${position.coords.longitude}`;
        console.log(btnGeo);
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=dfb545a573604021be494635230205&q=${btnGeo.dataset.geoLoc}&lang=fr&days=3&aqi=yes&alerts=no`
        );
        const geoWeatherData = await response.json();
        // geo = `${position.coords.latitude}, ${position.coords.longitude}`;
        // console.log(position.coords);
        console.log(geoWeatherData);
        header.classList.remove('header--landing');
        document.querySelector("form").classList.remove('form--landing');
        document.querySelector(".section-main").classList.remove('hidden');
        const temperature = document.getElementById("temperature");
        temperature.innerText = `${geoWeatherData.current.temp_c}°C`;
        const loc = document.getElementById("loc");
        loc.innerText = `${geoWeatherData.location.name} (${geoWeatherData.location.region}), ${geoWeatherData.location.country}`;
        // changer la taille/qualité de l'icône en 128x128
        let qualityOfIcon = "128x128";
        let url = `${geoWeatherData.current.condition.icon}`;
        let urlModified = url.split("/");
        urlModified[4] = qualityOfIcon;
        urlModified = urlModified.join("/");
        console.log("url: " + url);
        console.log(urlModified);
        img.src = `${urlModified}`;

        // autres fonctionnalités
        const sunrise = document.getElementById("sunrise");
        sunrise.innerText = `Lever du soleil: ${geoWeatherData.forecast.forecastday[0].astro.sunrise}`;
        const sunset = document.getElementById("sunset");
        sunset.innerText = `Coucher du soleil: ${geoWeatherData.forecast.forecastday[0].astro.sunset}`;
        console.log(
            `Température actuelle à ${geoWeatherData.location.name}: ${geoWeatherData.current.temp_c}°C`
        );
        console.log(
            `Temps actuel à ${geoWeatherData.location.name}: ${geoWeatherData.current.condition.text}`
        );
    }, function (error) {
        console.error("Erreur de géoloc N°" + error.code + " : " + error.message);
        console.log(error);
    }, {
        timeout: 2000,
        maximumAge: 60000
    });
}
const btnGeo = document.getElementById("btn-geoloc");
btnGeo.addEventListener("click", getMyPosition);


const searchInput = document.querySelector('input[name="search"]');
const suggestionsList = document.querySelector("#suggestions");
const header = document.querySelector("header");
let img = document.querySelector("#icon__weather");

async function searchCities(query) {
    if (query.length >= 3) {
        const response = await fetch(
            `https://api.weatherapi.com/v1/search.json?key=dfb545a573604021be494635230205&q=${query}`
        );
        const cities = await response.json();

        if (Array.isArray(cities)) {
            const suggestions = cities
                .map(
                    (city) =>
                        `<button data-location="${city.name}, ${city.region}, ${city.country}">${city.name} (${city.region}), ${city.country}</button>`
                )
                .join("");
            suggestionsList.innerHTML = suggestions;
            const cityButtons = document.querySelectorAll(
                "#suggestions button"
            );
            cityButtons.forEach((button) => {
                button.addEventListener("click", async () => {

                    // changement de header avec une animation
                    // au clic ajouter l'animation à header--landing
                    // header.

                    header.classList.remove('header--landing');
                    document.querySelector("form").classList.remove('form--landing');
                    document.querySelector(".section-main").classList.remove('hidden');

                    const location = button.dataset.location;
                    searchInput.value = location;
                    suggestionsList.innerHTML = "";

                    // changement de page
                    // window.location.href = "weather.html";

                    const response = await fetch(
                        `https://api.weatherapi.com/v1/forecast.json?key=dfb545a573604021be494635230205&q=${location}&lang=fr&days=3&aqi=yes&alerts=no`
                    );
                    const weatherData = await response.json();

                    const temperature = document.getElementById("temperature");
                    temperature.innerText = `${weatherData.current.temp_c}°C`;
                    const loc = document.getElementById("loc");
                    loc.innerText = `${weatherData.location.name} (${weatherData.location.region}), ${weatherData.location.country}`;

                    // img.src = `${weatherData.current.condition.icon}`;
                    // let url = img.src;

                    // changer la taille/qualité de l'icône en 128x128
                    let qualityOfIcon = "128x128";
                    let url = `${weatherData.current.condition.icon}`;
                    let urlModified = url.split("/");
                    urlModified[4] = qualityOfIcon;
                    urlModified = urlModified.join("/");
                    console.log("url: " + url);
                    console.log(urlModified);
                    img.src = `${urlModified}`;

                    // autres fonctionnalités
                    const sunrise = document.getElementById("sunrise");
                    sunrise.innerText = `Lever du soleil: ${weatherData.forecast.forecastday[0].astro.sunrise}`;
                    const sunset = document.getElementById("sunset");
                    sunset.innerText = `Coucher du soleil: ${weatherData.forecast.forecastday[0].astro.sunset}`;
                    console.log(
                        `Température actuelle à ${weatherData.location.name}: ${weatherData.current.temp_c}°C`
                    );
                    console.log(
                        `Temps actuel à ${weatherData.location.name}: ${weatherData.current.condition.text}`
                    );
                });
            });
        }
    }
}

window.addEventListener("click", (event) => {
    if (
        !event.target.matches("#suggestions") &&
        !event.target.matches('input[name="search"]')
    ) {
        suggestionsList.innerHTML = "";
    }
});

let timer;

searchInput.addEventListener("keyup", () => {
    clearTimeout(timer);
    timer = setTimeout(function () {
        const query = searchInput.value.trim();
        console.log(removeAccents(query));
        searchCities(removeAccents(query));
    }, 500);
});

// async function toGetValuesfromCity2(name) {
//     let response = await fetch(
//         `    https://api.weatherapi.com/v1/forecast.json?key=dfb545a573604021be494635230205&q=${name}&days=4&aqi=yes&alerts=no`
//     );
//     let valuesAPI = await response.json();
//     console.log(valuesAPI);
// }
// toGetValuesfromCity2("Caen");
// async function toGetValuesfromCity(name) {
//     let response = await fetch(
//         `https://api.weatherapi.com/v1/current.json?key=dfb545a573604021be494635230205&q=${name}&aqi=no`
//     );
//     let valuesAPI = await response.json();
//     console.log(valuesAPI);
// }
// toGetValuesfromCity("Caen");

// let response = await fetch(                      //search/autocomplete url
//     `https://api.weatherapi.com/v1/search.json?key=dfb545a573604021be494635230205&q=${query}`
// );
// console.log(valuesAPI.current.temp_c);
// console.log(valuesAPI.current.condition.text);
// console.log(valuesAPI.current.condition.icon);
// async function searchWeather(query){
//     const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=dfb545a573604021be494635230205&q=caen&aqi=no`);
//     const weather = await response.json();
//     console.log(weather.current.temp_c);
// }

// async function toGetCity(name) {
//     let response = await fetch(
//         `https://api.weatherapi.com/v1/search.json?key=dfb545a573604021be494635230205&q=${name}`
//     );
//     let cityAPI = await response.json();
//     console.log(cityAPI);
// }
// toGetCity("Wurzburg");

// Forecast to 10 days
// async function toGetValuesfromCity(name) {
//     let response = await fetch(
//         `https://api.weatherapi.com/v1/forecast.json?key=dfb545a573604021be494635230205&q=Caen&days=10&aqi=no&alerts=no`
//     );
//     let valuesAPI = await response.json();
//     console.log(valuesAPI);
// }
// toGetValuesfromCity("Caen");

// https://api.weatherapi.com/v1/forecast.json?key=dfb545a573604021be494635230205&q=Caen&days=10&aqi=no&alerts=no

// let url="http://api.weatherapi.com/v1/search.json?key=dfb545a573604021be494635230205&q="
// url+=location.name
// return url
