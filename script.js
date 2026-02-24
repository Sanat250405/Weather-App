document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const loadingSpinner = document.getElementById('loading');
    const errorContainer = document.querySelector('.error-container');
    const weatherDisplay = document.querySelector('.weather-display');

    const cityNameEl = document.querySelector('.city-name');
    const dateTimeEl = document.querySelector('.date-time');
    const weatherIconEl = document.querySelector('.weather-icon');
    const temperatureEl = document.querySelector('.temperature');
    const descriptionEl = document.querySelector('.weather-description');
    const feelsLikeEl = document.getElementById('feels-like');
    const humidityEl = document.getElementById('humidity');
    const windSpeedEl = document.getElementById('wind-speed');

    const apiKey = ENV_API_KEY;
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";
    
    const iconMap = {
        Clear: "clear.png",
        Clouds: "clouds.png",
        Rain: "rain.png",
        Drizzle: "drizzle.png",
        Mist: "mist.png",
        Snow: "snow.png",
        Haze: "mist.png",
        Fog: "mist.png",
    };

    const getWeatherData = async (city) => {
        if (!apiKey || apiKey !== ENV_API_KEY) {
            showError("Please paste your API key in script.js");
            return;
        }
        if (!city) return;

        showLoading();

        try {
            const response = await fetch(`${apiUrl}&q=${city}&appid=${apiKey}`);
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data = await response.json();
            updateUI(data);
        } catch (error) {
            showError(error.message);
        }
    };

    const updateUI = (data) => {
        const { main, weather, wind, name, timezone, dt } = data;
        const weatherCondition = weather[0].main;

        const localDateTime = new Date((dt + timezone) * 1000).toUTCString();
        const formattedDate = new Date(localDateTime).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
        const formattedTime = new Date(localDateTime).toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit', hour12: true
        });
        dateTimeEl.textContent = `${formattedDate}, ${formattedTime}`;

        cityNameEl.textContent = name;
        weatherIconEl.src = `images/${iconMap[weatherCondition] || 'clear.png'}`;
        weatherIconEl.alt = weatherCondition;
        temperatureEl.textContent = `${Math.round(main.temp)}°c`;
        descriptionEl.textContent = weather[0].description;
        
        feelsLikeEl.textContent = `${Math.round(main.feels_like)}°c`;
        humidityEl.textContent = `${main.humidity}%`;
        windSpeedEl.textContent = `${wind.speed.toFixed(1)} km/h`;

        showWeather();
    };

    const showLoading = () => {
        weatherDisplay.classList.remove('visible');
        errorContainer.style.display = 'none';
        loadingSpinner.style.display = 'block';
    };

    const showError = (message) => {
        loadingSpinner.style.display = 'none';
        weatherDisplay.classList.remove('visible');
        errorContainer.querySelector('p').textContent = `Error: ${message}`;
        errorContainer.style.display = 'block';
    };

    const showWeather = () => {
        loadingSpinner.style.display = 'none';
        errorContainer.style.display = 'none';
        weatherDisplay.classList.add('visible');
    };

    searchBtn.addEventListener('click', () => getWeatherData(cityInput.value));
    cityInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            getWeatherData(cityInput.value);
        }
    });

    getWeatherData('Mysore');
});
