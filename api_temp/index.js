// Weather code display → emoji and description 
const weatherCodes = {
    0: { description: "Clear Sky", icon: "☀️" },
    1: { description: "Mainly Clear", icon: "🌤️" },
    2: { description: "Partly Cloudy", icon: "⛅" },
    3: { description: "Overcast", icon: "☁️" },
    45: { description: "Fog", icon: "🌫️" },
    48: { description: "Depositing rime fog", icon: "🌫️" },
    51: { description: "Light Drizzle", icon: "🌦️" },
    53: { description: "Moderate Drizzle", icon: "🌦️" },
    55: { description: "Dense intensity Drizzle", icon: "🌦️" },
    56: { description: "Light Freezing Drizzle", icon: "❄️🌧️" },
    57: { description: "Dense Freezing Drizzle", icon: "❄️🌧️" },
    61: { description: "Light Rain", icon: "🌧️" },
    63: { description: "Moderate Rain", icon: "🌧️" },
    71: { description: "Snow", icon: "❄️" },
    95: { description: "Thunderstorm", icon: "⛈️" }
};

// Select button and display section
const button = document.getElementById("getWeather");
const weatherSection = document.getElementById("weatherDisplay");

// Add click event Button1 - Current Day Weather
button.addEventListener("click", function() {
//API that will display weather from one day. Open customized API was taken from https://open-meteo.com/
    fetch("https://api.open-meteo.com/v1/forecast?latitude=29.76&longitude=-95.36&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours,wind_speed_10m_max,sunrise,sunset,uv_index_max,weather_code&timezone=America%2FChicago&forecast_days=1")

    .then(function(response) {
        return response.json();
    })

    .then(function(data) {
    console.log("Weather Data:", data);
    const windspeed = data.daily.wind_speed_10m_max[0];//I needed [0] because the API returns arrays (lists), not single values.
    const tempMax = data.daily.temperature_2m_max[0];
    const tempMin = data.daily.temperature_2m_min[0];
    const precipitation = data.daily.precipitation_sum[0];
    const precipitationHours = data.daily.precipitation_hours[0];
    const sunrise = data.daily.sunrise[0];
    const sunset = data.daily.sunset[0];
        
        weatherSection.innerHTML = `
            <h2>Current Weather in Houston, TX</h2>
            <p>Temperature Max: ${tempMax}°C</p>
            <p>Temperature Min:${tempMin}°C</p>
            <p>Total Rainfall: ${precipitation}mm</p>
            <p>Rain Duration: ${precipitationHours}h</p>
            <p> Wind Speed: ${windspeed}km/h</p>
            <p> Sunrise: ${sunrise}</p>
            <p> Sunset: ${sunset}</p>
            <button id="forecastBtn">Click here to know forecast for 7 days</button> 
            <div id="forecastContainer"></div>
            `;

            // SECOND EVENT LISTENER (7-DAY FORECAST)
            const forecastButton = document.getElementById("forecastBtn");
            const forecastContainer = document.getElementById("forecastContainer");
            forecastButton.addEventListener("click", function () {

                fetch("https://api.open-meteo.com/v1/forecast?latitude=29.7633&longitude=-95.3633&daily=weather_code,temperature_2m_max,temperature_2m_min,rain_sum,wind_speed_10m_max")

                    .then(function (response) {
                        return response.json();
                    })

                    .then(function (forecastData7Days) {

                        let forecastHTML = "<h2>7-Day Forecast</h2>";

                        for (let i = 0; i < forecastData7Days.daily.time.length; i++) {

                            const code = forecastData7Days.daily.weather_code[i];

                            const weatherInfo = weatherCodes[code] || {
                                description: "Unknown",
                                icon: "❓"
                            };

                            forecastHTML += `
                                <div class="forecast-day">
                                    <h3>${forecastData7Days.daily.time[i]}</h3>
                                    <p style="font-size: 30px;">
                                        ${weatherInfo.icon}
                                    </p>
                                    <p><strong>${weatherInfo.description}</strong></p>
                                    <p>Max: ${forecastData7Days.daily.temperature_2m_max[i]}°C</p>
                                    <p>Min: ${forecastData7Days.daily.temperature_2m_min[i]}°C</p>
                                    <p>Rain: ${forecastData7Days.daily.rain_sum[i]}mm</p>
                                    <p>Wind: ${forecastData7Days.daily.wind_speed_10m_max[i]}km/h</p>
                                </div>
                                <hr>
                            `;
                        }

                        forecastContainer.innerHTML = forecastHTML;

                        // Disable button after click
                        forecastButton.disabled = true;
                        forecastButton.innerText = "Forecast Loaded";
                    })

                    .catch(function (error) {
                        console.error("Error fetching forecast:", error);
                        forecastContainer.innerHTML = "<p>Unable to load 7-day forecast.</p>";
                    });
            });
    })
    
    
    .catch(function(error) {
        console.error("Error fetching weather:", error);
        weatherSection.innerHTML = "<p>Unable to load weather data.</p>";
    });

});