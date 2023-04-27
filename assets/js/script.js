// Define variables to hold DOM elements
const cityInputEl = document.querySelector("#city-input");
const searchBtnEl = document.querySelector("#search-btn");
const searchedContainer = document.querySelector("#searched");
const currentWeatherEl = document.querySelector("#current-weather");
const forecastEl = document.querySelector("#forecast-container");
const clearSearchContainer = document.querySelector("#clear-container");

// Define API key and base URL for OpenWeatherMap API
const apiKey = "2cc1ce24b5152b770aef8a0464bfb715";
const apiUrl = "https://api.openweathermap.org/data/2.5/";

// variable
let searchHistory = [];

function getWeatherData(cityName) {
    // Call the API to get current weather data for the city
    fetch(`${apiUrl}weather?q=${cityName}&units=metric&appid=${apiKey}`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {

                    saveSearchHistory(data.name);

                    displayCurrentWeather(data);

                    getForecastData(cityName);

                });
            } else {
                handleInvalidInput();
            }
        })
        .catch(function (error) {
            console.error(error);
        });
}

function displayCurrentWeather(data) {
    // Create HTML elements to display the current weather data
    const firstSection = document.createElement("div");

    const cityEl = document.createElement("h2");
    cityEl.textContent = data.name;

    const dateEl = document.createElement("p");
    const currentDate = new Date();
    dateEl.textContent = currentDate.toDateString();

    const iconEl = document.createElement("img");
    iconEl.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    iconEl.alt = data.weather[0].description;

    const sectionSection = document.createElement("div");

    const tempEl = document.createElement("p");
    tempEl.textContent = `Temperature: ${data.main.temp} °C`;

    const humidityEl = document.createElement("p");
    humidityEl.textContent = `Humidity: ${data.main.humidity} %`;

    const windSpeedEl = document.createElement("p");
    windSpeedEl.textContent = `Wind Speed: ${data.wind.speed} m/s`;

    // Append the elements to the current weather container
    currentWeatherEl.innerHTML = "";
    firstSection.append(cityEl, dateEl, iconEl);
    sectionSection.append(tempEl, humidityEl, windSpeedEl);
    currentWeatherEl.append(firstSection, sectionSection);
}

function getForecastData(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    // Display the forecast data
                    displayForecast(data.list.filter(function (forecast) {
                        // Filter the list of forecasts to only include one per day (at 12:00:00)
                        return forecast.dt_txt.endsWith("12:00:00");
                    }));
                });
            } else {
                // Handle errors when the API call fails
                console.error(response.statusText);
            }
        })
        .catch(function (error) {
            // Handle errors when the API call fails
            console.error(error);
        });
}

function displayForecast(forecastData) {
    // Create HTML elements to display the forecast data
    forecastEl.innerHTML = "";
    forecastData.forEach(function (item_1) {
        const forecastItemEl = document.createElement("div");
        forecastItemEl.classList.add("forecast-card");
        forecastItemEl.classList.add("shadow");

        const dateEl_1 = document.createElement("p");
        const forecastDate = new Date(item_1.dt * 1000);
        dateEl_1.textContent = forecastDate.toDateString();

        const iconEl_1 = document.createElement("img");
        iconEl_1.src = `https://openweathermap.org/img/w/${item_1.weather[0].icon}.png`;
        iconEl_1.alt = item_1.weather[0].description;

        const tempEl_1 = document.createElement("p");
        tempEl_1.textContent = `Temperature: ${item_1.main.temp} °C`;

        const humidityEl_1 = document.createElement("p");
        humidityEl_1.textContent = `Humidity: ${item_1.main.humidity} %`;

        const windSpeedEl_1 = document.createElement("p");
        windSpeedEl_1.textContent = `Wind Speed: ${item_1.wind.speed} m/s`;

        // Append the elements to the forecast container
        forecastItemEl.append(dateEl_1, iconEl_1, tempEl_1, humidityEl_1, windSpeedEl_1);
        forecastEl.append(forecastItemEl);
    });
}

// Handle errors when the city input is invalid
function handleInvalidInput() {
    // Clear the current weather and forecast display
    currentWeatherEl.innerHTML = "";
    forecastEl.innerHTML = "";

    // Display an error message to the user
    const errorMsg = document.createElement("h2");
    errorMsg.textContent = "Invalid city name. Please enter a valid city name.";
    currentWeatherEl.append(errorMsg);
}

function createSearchedEl(cityName) {
    // create a new button element
    const searched = document.createElement("button");

    // set the text content of the button
    searched.textContent = cityName;
    searched.classList.add("btn");
    searched.classList.add("shadow");
    searched.id = "search-history-btn";

    searched.addEventListener("click", function () {
        console.log("history search");
        getWeatherData(searched.textContent);
    });

    // append the button to the container
    searchedContainer.appendChild(searched);
}

// Save the search history to local storage
function saveSearchHistory(city) {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        createSearchedEl(city);
        console.log('created save search ', city);
        if (searchHistory.length == 1) {
            createClearSearch();
        };
    }
}

// Load the search history from local storage
function loadSearchHistory() {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistory.forEach(function (city) {
        createSearchedEl(city);
    });
    if (searchHistory.length >= 1) {
        createClearSearch();
    }
}

function createClearSearch() {
    // create a new button element
    const clearSearch = document.createElement("button");

    // set the text content of the button
    clearSearch.textContent = 'Clear Search History';
    clearSearch.classList.add("btn");
    clearSearch.classList.add("shadow");
    clearSearch.id = "clear-search";

    // Clears search history 
    // Add event listener to the clear history button
    clearSearch.addEventListener("click", function () {
        // Clear the search history array
        searchHistory = [];

        // Clear the search history items from the DOM
        searchedContainer.innerHTML = "";
        clearSearchContainer.innerHTML="";

        // Save the empty search history array to local storage
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        // Re-populate the search history array from local storage
        searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    });

    // append the button to the container
    clearSearchContainer.appendChild(clearSearch);
}

loadSearchHistory();


// Define event listener for search button
searchBtnEl.addEventListener("click", function (event) {
    event.preventDefault();
    const cityName = cityInputEl.value.trim();
    // Create search history button
    // at the end because that means it found the city
    getWeatherData(cityName);
});
