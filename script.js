const apiKey = '610a6c155d3938a2d348516d20e6eccf';
const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');
const unitToggle = document.getElementById('unit-toggle');

let isCelsius = true;
let currentCity = '';

function fetchWeather(city) {
  const unit = isCelsius ? 'metric' : 'imperial';
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`)
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => {
      updateWeatherUI(data);
      currentCity = city;
      fetchForecast(city);
      updateBackground(data.weather[0].main.toLowerCase());
    })
    .catch(() => alert("City not found. Please enter a valid name."));
}

function updateWeatherUI(data) {
  document.getElementById('city-name').textContent = data.name;
  document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°${isCelsius ? 'C' : 'F'}`;
  document.getElementById('description').textContent = data.weather[0].description;
  document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} ${isCelsius ? 'km/h' : 'mph'}`;
  document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function fetchForecast(city) {
  const unit = isCelsius ? 'metric' : 'imperial';
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`)
    .then(res => res.json())
    .then(data => displayForecast(data));
}

function displayForecast(data) {
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = '';
  let dailyData = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyData[date]) {
      dailyData[date] = item;
    }
  });

  Object.values(dailyData).slice(0, 3).forEach(day => {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <h4>${new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</h4>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
      <p>${Math.round(day.main.temp)}°${isCelsius ? 'C' : 'F'}</p>
    `;
    forecastContainer.appendChild(card);
  });
}

function updateBackground(condition) {
  const bgVideo = document.getElementById('bg-video');

  if (condition.includes('rain')) {
    bgVideo.src = 'rainy.mp4';
  } else if (condition.includes('snow')) {
    bgVideo.src = 'snow.mp4';
  } else if (condition.includes('thunder') || condition.includes('storm')) {
    bgVideo.src = 'thunder.mp4';
  } else {
    bgVideo.src = 'sunny.mp4';
  }

  bgVideo.load();
  bgVideo.play();
}

searchButton.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city !== '') {
    fetchWeather(city);
  } else {
    alert('Please enter a city name.');
  }
});

unitToggle.addEventListener('click', () => {
  if (currentCity !== '') {
    isCelsius = !isCelsius;
    fetchWeather(currentCity);
  } else {
    alert('Search a city first.');
  }
});
