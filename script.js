// const searchInput = document.querySelector('input[name="search"]');
// const suggestionsList = document.querySelector("#suggestions");

// async function searchCities(query) {
//     if (query.length >= 3) {
//         const response = await fetch(
//             `https://api.weatherapi.com/v1/search.json?key=dfb545a573604021be494635230205&q=${query}`
//         );
//         const cities = await response.json();

//         if (Array.isArray(cities)) {
//             const suggestions = cities
//                 .map(
//                     (city) =>
//                         `<button>${city.name} (${city.region}), ${city.country}</button>`
//                 )
//                 .join("");
//             suggestionsList.innerHTML = suggestions;
//             const cityButtons = document.querySelectorAll(
//                 "#suggestions button"
//             );
//             cityButtons.forEach((button) => {
//                 button.addEventListener("click", () => {
//                     searchInput.value = button.textContent;
//                     suggestionsList.innerHTML = "";
//                 });
//             });
//         }
//     }
// }

// let timer;

// searchInput.addEventListener("keyup", () => {
//     clearTimeout(timer);
//     timer = setTimeout(function () {
//         const query = searchInput.value.trim();
//         searchCities(query);
//         console.log(query);
//     }, 500);
// });

const searchInput = document.querySelector('input[name="search"]');
const suggestionsList = document.querySelector("#suggestions");
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
                        `<button data-location="${city.name},${city.region},${city.country}">${city.name} (${city.region}), ${city.country}</button>`
                )
                .join("");
            suggestionsList.innerHTML = suggestions;
            const cityButtons = document.querySelectorAll(
                "#suggestions button"
            );
            cityButtons.forEach((button) => {
                button.addEventListener("click", async () => {
                    const location = button.dataset.location;
                    searchInput.value = location;
                    suggestionsList.innerHTML = "";

                    const response = await fetch(
                        `https://api.weatherapi.com/v1/current.json?key=dfb545a573604021be494635230205&q=${location}`
                    );
                    const weatherData = await response.json();

                    const temperature = document.getElementById("temperature");
                    temperature.innerText = `${weatherData.current.temp_c}°C`;
                    const loc = document.getElementById("loc");
                    loc.innerText = `${weatherData.location.name} (${weatherData.location.region}), ${weatherData.location.country}`;
                    img.src = `${weatherData.current.condition.icon}`;
                    // const weather = document.getElementById("weather");
                    // weather.innerText = `Température actuelle à ${weatherData.location.name}: ${weatherData.current.condition.icon}°C`;

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

let timer;

searchInput.addEventListener("keyup", () => {
    clearTimeout(timer);
    timer = setTimeout(function () {
        const query = searchInput.value.trim();
        searchCities(query);
        console.log(query);
    }, 500);
});

async function toGetValuesfromCity(name) {
    let response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=dfb545a573604021be494635230205&q=${name}&aqi=no`
    );
    // let response = await fetch(                      //search/autocomplete url
    //     `https://api.weatherapi.com/v1/search.json?key=dfb545a573604021be494635230205&q=${query}`
    // );
    let valuesAPI = await response.json();
    // console.log(valuesAPI.current.temp_c);
    // console.log(valuesAPI.current.condition.text);
    // console.log(valuesAPI.current.condition.icon);
    console.log(valuesAPI);
}
toGetValuesfromCity("Caen");
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
