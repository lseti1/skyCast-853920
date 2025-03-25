import { useState, useEffect, use} from 'react'

export const useWeather = (city, APIKey, url) => {
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => { 
            setLoading(true);
            setError(null);

            try {
                const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`);
                const weather = await weatherResponse.json();
                setWeatherData(weather);

                const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=metric`);
                const forecast = await forecastResponse.json();
                setForecastData(forecast);

                if (data.cod === "404") { // Handle API errors 
                    setError("City not found. Try again.");
                }  
            } catch (err) {
                console.log("Error Occurred:", err);
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        if (city) {
            fetchWeatherData();
        }
    }, [city, APIKey, url]);

    return {weatherData, forecastData, loading, error};
};
