// Notes may be scattered across code for the purposes of learning

import { useState, useEffect, use} from 'react'
import './App.css'
import { useWeather } from './hooks/useWeather';

function App() {
  const months = ['January', 'Febuary', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const [city, setCity] = useState(""); // Will Set this to some City but for now leave it empty to not use API calls
  const APIkey = import.meta.env.VITE_OPENWEATHER_API_KEY; // NOTE: APIkeys must have that variable name VITE_SOMETHING

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();

  const {forecastData, forecastLoading, forecastError } = useWeather(city, APIkey);
  const {weatherData, weatherLoading, weatherError } = useWeather(city, APIkey);

  const loading = weatherLoading || forecastLoading;
  const error = weatherError || forecastError;  

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(e.target.city.value);
    const inputCity = e.target.city.value;
    console.log("City Submitted: ", inputCity);
    setCity(inputCity);
  };

  function formatDateTime(timestamp) {
    const date = new Date(timestamp * 1000);
  
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }); // e.g. "Apr 9"
  
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true
    }); // e.g. "4 PM"
  
    return (
      <>
        {formattedDate}<br />
        {formattedTime}
      </>
    );
  }
  


  return (
    <div className='main'>
      <div className='searchBarTitleContainer'>
        <form onSubmit={handleSubmit}>
          <input className='searchBarInput' type="text" name="city" placeholder="Enter city name"/>
          <button className='searchButton' type="submit">Search</button>
        </form>
        <div>
          <h1 className="title">Skycast</h1>
        </div>
      </div>
      
      <div className='weatherForDayContainer'>
        <div className='titleForDay'>
          <h1>{city}</h1>
          <h1>{months[currentMonth]} {currentDay}</h1>
        </div>
        <div className='contentForDay'>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {weatherData && !loading && !error && (
            <>
              <div className='leftSideForDay'>
                <img className='weatherForDayIcon' src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} alt="weatherIcon" />
                <div className='leftSideDayInfo'>
                  <h2>{Math.round(weatherData.main.temp)}°C</h2>
                  <p>({weatherData.weather[0].description})</p>
                </div>
              </div>
              <div className='rightSideForDay'>
                <p>Max: {Math.round(weatherData.main.temp_max)}°C</p>
                <p>Min: {Math.round(weatherData.main.temp_min)}°C</p>
                <p>Feels Like: {Math.round(weatherData.main.feels_like)}°C</p>
                <p>Humidity: {weatherData.main.humidity}%</p>
                <p>Winds: {weatherData.wind.speed}m/s</p>
                <p>Cloud Cover: {weatherData.clouds.all}%</p>
                
              </div>
              {/* <div className='weatherForDay'>
                <p>Humidity: {weatherData.main.humidity}%<br  />Feels Like: {Math.round(weatherData.main.feels_like)}<br />Winds: {Math.round(weatherData.wind.speed)}</p>
              </div> */}
            </>
          )}
        </div>
      </div>
      
      
      <div className="dailyForecast">
      {forecastData && !loading && !error && (
        <>
          <h1>3-Hourly Forecast:</h1>
          <div className="dailyForecastDataContainer">
          {forecastData.list.filter((_, index) => index < 8).map((forecast, index) => (
            <div className="individualDailyForecastData"> 
              <h3>
                <img className="forecastIcons" src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png`} alt="weatherIcon" />
                {Math.round(forecast.main.temp)}°C<br  />
                {formatDateTime(forecast.dt)}
              </h3>
            </div>
            ))}
          </div>
        </>
      )} 
      </div>


        <div className="forecastContainer">
        {forecastData && !loading && !error && (
          <>
            <div className='forecastTitleContainer'>
              <h2>Weekly Forecast:</h2>
            </div>

            <div className='forecastDataContainer'>
              {forecastData.list.filter((_, index) => index % 8 === 7).map((forecast, index) => (
              <div className="individualForecastData">
                <img className="forecastIcons" src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png`} alt="weatherIcon" />
                <p>
                  <h2>{new Date(forecast.dt * 1000).toLocaleString(undefined, { day: "2-digit", month: "2-digit" })}, {Math.round(forecast.main.temp)}°C</h2>
                  Feels Like: {Math.round(forecast.main.feels_like)}°C ({forecast.weather[0].description})<br  />
                  Humidity: {forecast.main.humidity}%
                  Winds: {forecast.wind.speed} m/s
                </p>
              </div>
              ))}
            </div>
            <p>Note: Temperatures measured at </p>
          </>
        )}
    </div>

    </div>
  );
};

export default App
