// Notes may be scattered across code for the purposes of learning

import { useState, useEffect, use} from 'react'
import './App.css'
import { useWeather } from './hooks/useWeather';

function App() {
  const months = ['January', 'Febuary', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const [city, setCity] = useState("Brisbane"); // Will Set this to some City but for now leave it empty to not use API calls
  const APIkey = import.meta.env.VITE_OPENWEATHER_API_KEY; // NOTE: APIkeys must have that variable name VITE_SOMETHING

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();

  const {forecastData, forecastLoading, forecastError } = useWeather(city, APIkey);
  const {weatherData, weatherLoading, weatherError } = useWeather(city, APIkey);

  const loading = weatherLoading || forecastLoading;
  const error = weatherError || forecastError;  

  const [dailyForecastType, setDailyForecastType] = useState("Temp");

  function getForecastTypeValues(type, forecast) {
    switch(type) {
      case 'Temp':
        return `${Math.round(forecast.main.temp)}°C`
      case 'Wind':
        return `${Math.round(forecast.wind.speed)} m/s`
      case 'Humidity':
        return `${forecast.main.humidity}%`
      case 'Rain':
        return `${forecast.rain?.["3h"] ?? 0} mm`
      default:
        return 'N/A';
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(e.target.city.value);
    const inputCity = e.target.city.value;
    console.log("City Submitted: ", inputCity);
    setCity(inputCity);
  };

  function formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {day: "2-digit", month: "2-digit"});
  }

  function formatDateToWords(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {day: "numeric", month: "short"});
  }

  function formatDateToDay(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {weekday: "long"});
  }

  function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {hour: "numeric", hour12: true});
  }

  function formatTimeToHoursMinutes(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {hour: "2-digit", minute: "2-digit", hour12: true});
  }

  return (
    <div className='main'>
      <div className='searchBarTitleContainer'>
        <form onSubmit={handleSubmit}>
          <input className='searchBarInput' type="text" name="city" placeholder="Enter City (e.g. Brisbane)"/>
          <button className='searchButton' type="submit">Search</button>
        </form>
        <h1 className="title">Skycast</h1>
      </div>
      
      <div className='weatherForDayContainer'>
        {weatherData && !loading && !error && (
        <div className='titleForDay'>
          <h1>{city}</h1>
          <h2>{formatDateToWords(weatherData.dt)}<br />{formatTime(weatherData.dt)}</h2>
        </div>
        )}

        <div className='contentForDay'>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {weatherData && !loading && !error ? (
            <>
              <div className='leftSideForDay'>
                <img className='weatherForDayIcon' src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} alt="weatherIcon" />
                <div className='leftSideDayInfo'>
                  <h2>{Math.round(weatherData.main.temp)}°C</h2>
                  <h2>({weatherData.weather[0].description})</h2>
                </div>
              </div>
              <div className='rightSideForDay'>
                <p>Max: {Math.round(weatherData.main.temp_max)}°C</p>
                <p>Min: {Math.round(weatherData.main.temp_min)}°C</p>
                <p>Feels Like: {Math.round(weatherData.main.feels_like)}°C</p>
                <p>Humidity: {weatherData.main.humidity}%</p>
                <p>Sunrise: {formatTimeToHoursMinutes(weatherData.sys.sunrise)}</p>
                <p>Sunset: {formatTimeToHoursMinutes(weatherData.sys.sunset)}</p>
              </div>
              {/* <div className='weatherForDay'>
                <p>Humidity: {weatherData.main.humidity}%<br  />Feels Like: {Math.round(weatherData.main.feels_like)}<br />Winds: {Math.round(weatherData.wind.speed)}</p>
              </div> */}
            </>
          ) : (
            <h2>No Weather To Show for Today (Enter A City In Search Bar)</h2>
          )}
        </div>
      </div>
      
      
      <div className="dailyForecast">
      {forecastData && !loading && !error ? (
        <>
          <h1>3-Hourly Forecast</h1>
          <p>Forecast for next 48 hours</p>
          <div className='dailyForecastSelectionContainer'>
            <select className='dailyForecastSelector' value={dailyForecastType} onChange={(e) => setDailyForecastType(e.target.value)}>
              <option value="Temp">°C</option>
              <option value="Wind">🌀</option>
              <option value="Humidity">💧</option>
              <option value="Rain">🌧️</option>
            </select>
          </div>
          <div className="dailyForecastDataContainer">
          {forecastData.list.filter((_, index) => index < 17).map((forecast, index) => (
            <div className="individualDailyForecastData"> 
              <h3>
                <img className="forecastIcons" src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png`} alt="weatherIcon" />
                {/* {Math.round(forecast.main.temp)}°C<br  /> */}
                {getForecastTypeValues(dailyForecastType, forecast)}<br  />
                {formatTime(forecast.dt)}
                
              </h3>
              <p className='dailyForecastDates'>
                {formatDate(forecast.dt)}
              </p>
            </div>
            ))}
          </div>
        </>
      ) : (
        <h2>No Daily Forecast To Show</h2>
      )} 
      </div>

        <div className="forecastContainer">
        {forecastData && !loading && !error ? (
          <>
            <div className='forecastTitleContainer'>
              <h1>Weekly Forecast</h1>
              <p>Note: Temperatures measured at {formatTime(weatherData.dt)}</p>
            </div>
            <div className='forecastDataContainer'>
              {forecastData.list.filter((_, index) => index % 8 === 7).map((forecast, index) => (
              <div className="individualForecastData">
                <img className="forecastIcons" src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png`} alt="weatherIcon" />
                <p>
                  <h2>{formatDateToDay(forecast.dt)}, {Math.round(forecast.main.temp)}°C</h2>
                  Feels Like: {Math.round(forecast.main.feels_like)}°C ({forecast.weather[0].description})<br  />
                </p>
              </div>
              ))}
            </div>
            
          </>
        ) : (
          <h2>No Weekly Forecast To Show</h2>
        )}
    </div>

    </div>
  );
};

export default App
