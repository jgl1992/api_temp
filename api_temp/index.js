/* pushing my buttons */
const button = document.getElementById("getWeather");
const weatherSection = document.getElementById("weatherDisplay");

/* click button - Today's Forecast */
button.addEventListener("click", function () {

    fetch("https://api.open-meteo.com/v1/forecast?latitude=29.76&longitude=-95.36&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m&temperature_unit=celsius&timezone=auto")
        .then(response => response.json())
        .then(data => {
            console.log("Current Weather:", data);

            const current = data.current;

            weatherSection.innerHTML = `
                <h2>Current Weather</h2>
                <p><strong>Temperature:</strong> ${current.temperature_2m}°C</p>
                <p><strong>Feels Like:</strong> ${current.apparent_temperature}°C</p>
                <p><strong>Humidity:</strong> ${current.relative_humidity_2m}%</p>
                <p><strong>Wind Speed:</strong> ${current.wind_speed_10m} km/h</p>
                <p><strong>Weather Code:</strong> ${current.weather_code}</p>
            `;
        })
        .catch(error => {
            console.error("Error fetching weather:", error);
            weatherSection.innerHTML = "<p>Unable to load weather data.</p>";
        });
});