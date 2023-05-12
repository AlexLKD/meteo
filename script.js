// display none element transitionned after and of transition
const logoTransition = document.querySelector(".logo-transition");
logoTransition.addEventListener("animationend", function () {
    logoTransition.style.display = "none";
});

// normalize() convert string to normalize Unicode format   +  replace for replace by empty string special caracters
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Do the transition from home screen to weather display
function doTransition() {
    // Shrinks header's height
    header.classList.remove("header--landing");
    document.querySelector("form").classList.remove("form--landing");
    // Displays weather's screen
    document.querySelector(".section-main").classList.remove("hidden");
    document
        .querySelector(".section-div__localisation")
        .classList.remove("hidden");
    document.querySelector(".future").classList.remove("hidden");
}

/**
 * This function allows to change the weather icon to display a bigger icon for the current weather
 * @param {string} url - Icon URL
 * @returns {string} Modified URL with a different size
 */
function changeWeatherIconSize(url) {
    let qualityOfIcon = "128x128";
    let urlModified = url.split("/");
    urlModified[4] = qualityOfIcon;
    urlModified = urlModified.join("/");
    return urlModified;
}

// function geoLocalisation
function getMyPosition() {
    // navigator contains user's informations / getCurrentPosition asks for the device's position
    navigator.geolocation.getCurrentPosition(
        async function (position) {
            doTransition();
            // get latitude and longitude for a precise geolocation
            btnGeo.dataset.geoLoc = `${position.coords.latitude}, ${position.coords.longitude}`;
            // modified URL to get weather from the obtained geolocation
            const response = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=dfb545a573604021be494635230205&q=${btnGeo.dataset.geoLoc}&lang=fr&days=4&aqi=yes&alerts=no`
            );
            const geoWeatherData = await response.json();
            const temperature = document.getElementById("temperature");
            temperature.innerText = `${geoWeatherData.current.temp_c}°C`;
            const loc = document.getElementById("loc");
            loc.innerText = `${geoWeatherData.location.name} (${geoWeatherData.location.region}), ${geoWeatherData.location.country}`;
            // call function to change current weather icon's size
            img.src = changeWeatherIconSize(
                geoWeatherData.current.condition.icon
            );
            console.log(response);

            // autres fonctionnalités
            const sunrise = document.getElementById("sunrise");
            sunrise.innerText = `Lever du soleil: ${geoWeatherData.forecast.forecastday[0].astro.sunrise}`;
            const sunset = document.getElementById("sunset");
            sunset.innerText = `Coucher du soleil: ${geoWeatherData.forecast.forecastday[0].astro.sunset}`;
            // for(i = 1; i < 4; i++){
            //     imgFuture1.src = `${geoWeatherData.forecast.forecastday[1].day.condition.icon}`;
            // futureDate__date1.innerText = `${geoWeatherData.forecast.forecastday[1].date}`;
            // futureDate__temp1.innerText = `${geoWeatherData.forecast.forecastday[1].day.avgtemp_c}°C`;
            // }
            imgFuture1.src = `${geoWeatherData.forecast.forecastday[1].day.condition.icon}`;
            futureDate__date1.innerText = `${geoWeatherData.forecast.forecastday[1].date}`;
            futureDate__temp1.innerText = `${geoWeatherData.forecast.forecastday[1].day.avgtemp_c}°C`;

            imgFuture2.src = `${geoWeatherData.forecast.forecastday[2].day.condition.icon}`;
            futureDate__date2.innerText = `${geoWeatherData.forecast.forecastday[2].date}`;
            futureDate__temp2.innerText = `${geoWeatherData.forecast.forecastday[2].day.avgtemp_c}°C`;

            imgFuture3.src = `${geoWeatherData.forecast.forecastday[3].day.condition.icon}`;
            futureDate__date3.innerText = `${geoWeatherData.forecast.forecastday[3].date}`;
            futureDate__temp3.innerText = `${geoWeatherData.forecast.forecastday[3].day.avgtemp_c}°C`;
        },
        function (error) {
            console.error(
                "Erreur de géoloc N°" + error.code + " : " + error.message
            );
            console.log(error);
        },
        {
            timeout: 2000,
            maximumAge: 60000,
        }
    );
}
const btnGeo = document.getElementById("btn-geoloc");
btnGeo.addEventListener("click", getMyPosition);

const searchInput = document.querySelector('input[name="search"]');
const suggestionsList = document.querySelector("#suggestions");
const header = document.querySelector("header");
let img = document.querySelector("#icon__weather");
let imgFuture1 = document.querySelector("#icon__weather--future-day1");
let imgFuture2 = document.querySelector("#icon__weather--future-day2");
let imgFuture3 = document.querySelector("#icon__weather--future-day3");

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

                    header.classList.remove("header--landing");
                    document
                        .querySelector("form")
                        .classList.remove("form--landing");
                    document
                        .querySelector(".section-main")
                        .classList.remove("hidden");
                    document
                        .querySelector(".section-div__localisation")
                        .classList.remove("hidden");
                    document
                        .querySelector(".future")
                        .classList.remove("hidden");
                    const location = button.dataset.location;
                    // document.getElementById("loc").dataset
                    searchInput.value = location;
                    suggestionsList.innerHTML = "";

                    // changement de page
                    // window.location.href = "weather.html";

                    const response = await fetch(
                        `https://api.weatherapi.com/v1/forecast.json?key=dfb545a573604021be494635230205&q=${location}&lang=fr&days=4&aqi=yes&alerts=no`
                    );
                    const weatherData = await response.json();

                    const temperature = document.getElementById("temperature");
                    temperature.innerText = `${weatherData.current.temp_c}°C`;
                    const loc = document.getElementById("loc");
                    loc.innerText = `${weatherData.location.name} (${weatherData.location.region}), ${weatherData.location.country}`;

                    img.src = changeWeatherIconSize(
                        weatherData.current.condition.icon
                    );

                    // autres fonctionnalités
                    const sunrise = document.getElementById("sunrise");
                    sunrise.innerText = `Lever du soleil: ${weatherData.forecast.forecastday[0].astro.sunrise}`;
                    const sunset = document.getElementById("sunset");
                    sunset.innerText = `Coucher du soleil: ${weatherData.forecast.forecastday[0].astro.sunset}`;

                    imgFuture1.src = `${weatherData.forecast.forecastday[1].day.condition.icon}`;
                    futureDate__date1.innerText = `${weatherData.forecast.forecastday[1].date}`;
                    futureDate__temp1.innerText = `${weatherData.forecast.forecastday[1].day.avgtemp_c}°C`;

                    imgFuture2.src = `${weatherData.forecast.forecastday[2].day.condition.icon}`;
                    futureDate__date2.innerText = `${weatherData.forecast.forecastday[2].date}`;
                    futureDate__temp2.innerText = `${weatherData.forecast.forecastday[2].day.avgtemp_c}°C`;

                    imgFuture3.src = `${weatherData.forecast.forecastday[3].day.condition.icon}`;
                    futureDate__date3.innerText = `${weatherData.forecast.forecastday[3].date}`;
                    futureDate__temp3.innerText = `${weatherData.forecast.forecastday[3].day.avgtemp_c}°C`;

                    let future = Date(weatherData.forecast.forecastday[1].date);
                    console.log(future);
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
}); // arreêter nla propagation de l'évenement

let timer;

searchInput.addEventListener("keyup", () => {
    clearTimeout(timer);
    timer = setTimeout(function () {
        const query = searchInput.value.trim();
        searchCities(removeAccents(query));
    }, 500);
});

// async function toGetValuesfromCity2(name) {
//     let response = await fetch(
//         `    https://api.weatherapi.com/v1/forecast.json?key=dfb545a573604021be494635230205&q=${name}&days=3&aqi=yes&alerts=no`
//     );
// }
// toGetValuesfromCity2("Caen");
