// DOM Elements
const cityInput = document.getElementById("city-input");
const getWeatherBtn = document.getElementById("get-weather-btn");
const currentDate = document.getElementById("current-date");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const weatherIcon = document.getElementById("weather-icon");
const weatherDescription = document.getElementById("weather-description");
const maxTemp = document.getElementById("max-temp");
const minTemp = document.getElementById("min-temp");

// Month Names for Date
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Set Current Date
const now = new Date();
const month = monthNames[now.getMonth()];
const day = now.getDate();
const year = now.getFullYear();
currentDate.innerText = `${month} ${day}, ${year}`;

// Map Setup
const map = L.map("map").setView([20.5937, 78.9629], 5); // Default India view
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data &copy; OpenStreetMap contributors"
}).addTo(map);
let marker = null;

// Fetch Weather Data
const fetchWeather = async () => {
    const city = cityInput.value.trim();

    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    try {
        // Fetch Weather API
        const apiKey = "3f161e476675a3593a4072ca112d20b4";
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) throw new Error("City not found!");

        const data = await response.json();

        // Update Weather Details
        cityName.innerText = data.name;
        temperature.innerText = `${Math.round(data.main.temp)}°C`;
        weatherDescription.innerText = data.weather[0].description;
        weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">`;
        maxTemp.innerText = `${Math.round(data.main.temp_max)}°C`;
        minTemp.innerText = `${Math.round(data.main.temp_min)}°C`;

        // Update Map Marker
        const { lat, lon } = data.coord;
        if (marker) map.removeLayer(marker); // Remove previous marker
        marker = L.marker([lat, lon]).addTo(map)
            .bindPopup(`<b>${data.name}</b><br>${Math.round(data.main.temp)}°C`)
            .openPopup();

        // Center Map
        map.setView([lat, lon], 10);

    } catch (error) {
        alert(error.message);
    }
};

// Event Listener
getWeatherBtn.addEventListener("click", fetchWeather);
