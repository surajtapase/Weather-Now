// src/components/WeatherSearch.js
import React, { useState } from 'react';
import { WiThermometer, WiStrongWind, WiDirectionUp } from 'react-icons/wi';

const WeatherSearch = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = async () => {
   
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found');
      }

      const { latitude, longitude } = geoData.results[0];

      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const weatherData = await weatherResponse.json();

      setWeatherData(weatherData.current_weather);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-700 p-6">
      <div className="w-full max-w-md bg-white bg-opacity-90 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Enter City</h1>
        
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          placeholder="Enter city name"
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        />
        
        <button
          onClick={handleSearch}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 transition mb-6"
        >
          Get Weather
        </button>

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {weatherData && (
          <div className="text-center mt-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Weather in {city}</h2>
            <div className="flex justify-center items-center space-x-4">
              <WiThermometer className="text-4xl text-blue-600" />
              <p className="text-lg text-gray-600 font-medium">Temperature: {weatherData.temperature}°C</p>
            </div>
            <div className="flex justify-center items-center space-x-4">
              <WiStrongWind className="text-4xl text-green-600" />
              <p className="text-lg text-gray-600 font-medium">Wind Speed: {weatherData.windspeed} km/h</p>
            </div>
            <div className="flex justify-center items-center space-x-4">
              <WiDirectionUp className="text-4xl text-yellow-600" />
              <p className="text-lg text-gray-600 font-medium">Wind Direction: {weatherData.winddirection}°</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherSearch;
