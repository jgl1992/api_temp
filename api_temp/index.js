// ───────── Grab DOM elements ─────────
const button         = document.getElementById("getWeather");
const weatherSection = document.getElementById("weatherDisplay");

// ───────── WMO weather code → readable description ─────────
const WMO_CODES = {
  0:  "Clear Sky ☀️",
  1:  "Mainly Clear 🌤️",
  2:  "Partly Cloudy ⛅",

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
