// ───────── Grab DOM elements ─────────
const button         = document.getElementById("getWeather");
const weatherSection = document.getElementById("weatherDisplay");

// ───────── WMO weather code → readable description ─────────
const WMO_CODES = {

  0:  { description: "Clear sky", icon: "☀️" },
  1:  { description: "Mainly clear", icon: "🌤️" },
  2:  { description: "Partly cloudy", icon: "⛅" },
  3:  { description: "Overcast", icon: "☁️" },
  45: { description: "Fog", icon: "🌫️" },
  48: { description: "Depositing rime fog", icon: "🌫️" },
  51: { description: "Drizzle: Light intensity", icon: "🌦️" },
  53: { description: "Drizzle: Moderate intensity", icon: "🌦️" },
  55: { description: "Drizzle: Dense intensity", icon: "🌦️" },
  56: { description: "Freezing Drizzle: Light", icon: "🌧️" },
  57: { description: "Freezing Drizzle: Dense", icon: "🌧️" },
  61: { description: "Rain: Slight intensity", icon: "🌧️" },
  63: { description: "Rain: Moderate intensity", icon: "🌧️" },
  65: { description: "Rain: Heavy intensity", icon: "🌧️" },
  66: { description: "Freezing Rain: Light", icon: "🌧️" },
  67: { description: "Freezing Rain: Heavy", icon: "🌧️" },
  71: { description: "Snow fall: Slight intensity", icon: "🌨️" },
  73: { description: "Snow fall: Moderate intensity", icon: "🌨️" },
  75: { description: "Snow fall: Heavy intensity", icon: "❄️" },
  77: { description: "Snow grains", icon: "🌨️" },
  80: { description: "Rain showers: Slight", icon: "🌦️" },
  81: { description: "Rain showers: Moderate", icon: "🌧️" },
  82: { description: "Rain showers: Violent", icon: "🌧️" },
  85: { description: "Snow showers: Slight", icon: "🌨️" },
  86: { description: "Snow showers: Heavy", icon: "❄️" },
  95: { description: "Thunderstorm: Slight or moderate", icon: "⛈️" },
  96: { description: "Thunderstorm with slight hail", icon: "⛈️" },
  99: { description: "Thunderstorm with heavy hail", icon: "⛈️" }
};

};

function describeWeather(code) {
  return WMO_CODES[code] || `Unknown condition (code ${code})`;
}

// ───────── Fetch weather from Open-Meteo ─────────
async function getWeather(latitude, longitude) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m` +
    `&temperature_unit=celsius` +
    `&timezone=auto`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Current weather:", data);
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error.message);
    return null;
  }
}

// ───────── Render to the page ─────────
function renderWeather(data) {
  if (!data || !data.current) {
    weatherSection.innerHTML = "<p>Unable to load weather data.</p>";
    return;
  }

  const c = data.current;

  weatherSection.innerHTML = `
    <h2>Current Weather</h2>
    <p><strong>Temperature:</strong> ${c.temperature_2m}°C</p>
    <p><strong>Condition:</strong> ${describeWeather(c.weather_code)}</p>
  `;
}

// ───────── Wire up the button ─────────
button.addEventListener("click", async () => {
  weatherSection.innerHTML = "<p>Loading…</p>";

  // Houston, TX coordinates (change as you like)
  const latitude  = 29.76;
  const longitude = -95.36;

  const data = await getWeather(latitude, longitude);
  renderWeather(data);
});
