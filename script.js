
document.getElementById('city').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        getWeather(); 
    }
});


const apiKey = 'P4XNFJ9W5GRLSH7LJ4EZ7GB7C';

function getWeather() {
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/today?unitGroup=metric&key=${apiKey}&contentType=json`;
    const forecastUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
            alert('Error fetching current weather. Please try again later.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.days);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again later.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (!data || !data.currentConditions) {
        weatherInfoDiv.innerHTML = `<p>Weather data not available</p>`;
        return;
    }

    const cityName = data.resolvedAddress;
    const temperature = Math.round(data.currentConditions.temp); 
    const description = data.currentConditions.conditions;
    const iconKeyword = data.currentConditions.icon;
    const iconUrl = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/58c79610addf3d4d91471abbb95b05e96fb43019/PNG/3rd%20Set%20-%20Color/${iconKeyword}.png`;

    const temperatureHtml = `<p>${temperature}°C</p>`;

    const weatherHtml = `
        <p>${cityName}</p>
        <p>${description}</p>
    `;

    tempDivInfo.innerHTML = temperatureHtml;
    weatherInfoDiv.innerHTML = weatherHtml;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.style.display = 'block'; 
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = '';

    if (!hourlyData || hourlyData.length === 0) {
        hourlyForecastDiv.innerHTML = `<p>Hourly forecast not available.</p>`;
        return;
    }


    const next8Hours = hourlyData[0].hours.slice(0, 8);

    next8Hours.forEach(hour => {
        const dateTime = new Date(hour.datetimeEpoch * 1000);
        const formattedHour = dateTime.getHours();
        const temperature = Math.round(hour.temp); 
        const iconKeyword = hour.icon;
        const iconUrl = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/58c79610addf3d4d91471abbb95b05e96fb43019/PNG/3rd%20Set%20-%20Color/${iconKeyword}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${formattedHour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}
