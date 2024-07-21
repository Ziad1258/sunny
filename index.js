const searchButton = document.getElementById("searchButton");
const searchInput = document.querySelector("input");
const weatherBox = document.querySelector(".weatherBox");
let active = false;

const weatherIcons = {
  clear: "./images/clear.png",
  sunny: "./images/clear.png",
  mist: "./images/mist.png",
  cloudy: "./images/cloud.png",
  rain: "./images/rain.png",
  snow: "./images/snow.png",
  Error: "./images/404.png",
};

async function fetchWeatherData(city) {
  const api = `https://api.weatherapi.com/v1/current.json?key=9d9051c3b9bd47d5b57131431241404&q=${city}&aqi=no`;
  try {
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    addInfoToElement(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    handleError();
    return null;
  }
}

searchButton.addEventListener("click", () => {
  active = true;

  active
    ? weatherBox.classList.add("active")
    : weatherBox.classList.remove("active");

  const city = searchInput.value.trim();
  const cityRegex = /[a-zA-Z]/gi;
  if (cityRegex.test(city)) {
    fetchWeatherData(city);
  } else {
    handleError();
  }
});

function addInfoToElement(data) {
  const { current, location } = data;
  const currentWeatherText = current.condition.text.toLowerCase();
  // if the current weather text (i get it from the api) includes one of the weatherIcons object keys , then add the same argumen as img src , otherwise put the default icon
  const weatherImage = Object.keys(weatherIcons).find((key) =>
    currentWeatherText.includes(key)
  )
    ? weatherIcons[
        Object.keys(weatherIcons).find((key) =>
          currentWeatherText.includes(key)
        )
      ]
    : current.condition.icon;
  weatherBox.innerHTML = `
    <img class="weatherImage" src="${weatherImage}" alt="image" />
    <p class="temp">${Math.floor(current.temp_c)}</p>
    <p class="currentCondition">${current.condition.text}</p>
     <p class="currentCondition">${location.region + "," + location.country}</p>

    <div class="weatherInfo">
      <div class="humidityInfo">
        <i class="fas fa-tint"></i>
        <div class="humidity"> 
          <h3>Humidity</h3>
          <p>${current.humidity}%</p>
        </div>
      </div>
      <div class="windSpeedInfo">
        <i class="fas fa-wind"></i>
        <div class="windSpeed"> 
          <h3>Wind Speed</h3>
          <p>${current.wind_kph} km/h</p>
        </div>
      </div>
    </div>
  `;
}

function handleError() {
  weatherBox.innerHTML = ` <img class="errorImage" src= ${weatherIcons.Error} alt="error" />
    <p class = "errorMessage">Error: Invalid City Name</p>
   `;
  searchInput.value = "";
  searchInput.focus();
}
