// Notes may be scattered across code for the purposes of learning

import { useState, useEffect, use} from 'react'
import './App.css'
import { useWeather } from './hooks/useWeather';

function App() {
  const [city, setCity] = useState(""); // Will Set this to some City but for now leave it empty to not use API calls
  const APIkey = import.meta.env.VITE_OPENWEATHER_API_KEY; // NOTE: APIkeys must have that variable name VITE_SOMETHING

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


  return (
    <div>
      <h1>Skycast</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="city" placeholder="Enter city name"/>
        <button type="submit">Search</button>
      </form>
      

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {weatherData && !loading && !error && (
        <div>
          <h2>Weather in {city}</h2>
          <p>Temperature: {Math.round(weatherData.main.temp)}°C (Max: {Math.round(weatherData.main.temp_max)} & Min: {Math.round(weatherData.main.temp_min)})</p>
          <p>Description: {weatherData.weather[0].description}, {weatherData.weather[0].main}</p>
        </div>
      )}

      {forecastData && !loading && !error && (
        <div>
          <h2>3-Hour Forecast for {city}</h2>
          {forecastData.list.filter((_, index) => index % 8 === 7).map((forecast, index) => (
            <div>
              <p>
                {new Date(forecast.dt * 1000).toLocaleString(undefined, { day: "2-digit", month: "2-digit"})} - Temp: {Math.round(forecast.main.temp)}°C
                <br />
                Weather: {forecast.weather[0].description}
                <br />
                Humidity: {forecast.main.humidity}%
                <br />
                Feels Like: {Math.round(forecast.main.feels_like)}°C
                <img src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`} alt="weatherIcon" />
                <br />
                Wind Speed: {forecast.wind.speed} m/s
              </p>
            </div>
          ))}
        </div>
      )}

      
    </div>
  );
};

export default App
