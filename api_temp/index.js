const button = document.getElementById("getWeather");
const weatherSection = document.getElementById("weatherDisplay");

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

  const c = data.current;

  weatherSection.innerHTML = `
    <h2>Weather</h2>
    <p><strong>Temperature:</strong> ${c.temperature_2m}°C</p>
    <p><strong>Condition:</strong> ${describeWeather(c.weather_code)}</p>
  `;
}
button.addEventListener("click", async () => {
  weatherSection.innerHTML = "<p>Loading…</p>";
  const latitude  = 29.76;
  const longitude = -95.36;

  const data = await getWeather(latitude, longitude);
  renderWeather(data);
});
