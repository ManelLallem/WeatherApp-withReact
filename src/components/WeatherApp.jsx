import React from "react";
import { useState } from "react";
import axios from "axios";
import "../components/weather.css";

function WeatherApp(props) {
  let [cityName, setCityName] = useState("");
  let [data, setData] = useState(null);
  let [description,setDescription]=useState("")
  let [bg_image,setBg_image]=useState("")

  let handleWeatherCode=(weatherCode)=>{
    if (weatherCode === 0) {
      setDescription("Clear Sky")
      setBg_image("clear")

  } else if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3 ) {
    setDescription("Partly cloudy")
     setBg_image('cloud')

  } else if (weatherCode === 45 || weatherCode === 48) {
    setDescription("Fog")
     setBg_image('fog')

  } else if (weatherCode === 51 || weatherCode === 53 || weatherCode === 55|| weatherCode === 56|| weatherCode === 57) {
    setDescription("Drizzle")
     setBg_image('drizzle')

  } else if (weatherCode === 61 || weatherCode === 63 || weatherCode === 65|| weatherCode === 80|| weatherCode === 81|| weatherCode === 82) {
    setDescription("Rain")
     setBg_image('rain')

  } else if (weatherCode === 66 || weatherCode === 67) {
    setDescription("Freezing rain")
    setBg_image('freezRain')
  } else if (weatherCode === 71 || weatherCode === 73 || weatherCode === 75|| weatherCode === 77|| weatherCode === 85|| weatherCode === 86) {
    setDescription("Snow")
    setBg_image('snow')

  } else if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99) {
    setDescription("Thunderstorm")
    setBg_image('thunderstorm')
  } else {
      setDescription("Unknown weather code")
  }
  }

  let getLocation = async (city) => {
    const location = await axios.get(
      `https://api.api-ninjas.com/v1/city?name=${city}`,
      {
        headers: {
          "X-Api-Key": "Go7rOvXTFKM0ZzjlLEm2Jg==FI6u1GP25bbqs4gP",
        },
      }
    );
    return {
      latitude: location.data[0].latitude,
      longitude: location.data[0].longitude,
    };
  };

  let getWeather = async (city) => {
    const locationData = await getLocation(city);

    if (locationData) {
      const { latitude, longitude } = locationData;
      const weather = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`
      );
      console.log(weather.data);
      return weather.data;
    }
  };

  let handleClick = async (city) => {
    let response = await getWeather(city);
    handleWeatherCode(response.current.weather_code)
    setData({
      code: response.current.weather_code,
      temp: response.current.temperature_2m,
      date: new Date(response.current.time),
      humidity: response.current.relative_humidity_2m,
      prec: response.current.precipitation,
      wind: response.current.wind_speed_10m,
      apparent_temp: response.current.apparent_temperature,
      max_temp: response.daily.temperature_2m_max[0],
      min_temp: response.daily.temperature_2m_min[0],
    });
    
    
  };

  return (
    <div className={`bg ${data ? bg_image : ''}`}> 
     <div id="container">
      <section id="main">
        <div id="search">
          <input
            id="searchInput"
            type="text"
            placeholder="Enter a city name"
            value={cityName}
            onChange={(event) => setCityName(event.target.value)}
          />
          <input
            id="searchButton"
            type="button"
            value=""
            onClick={() => handleClick(cityName)}
          />
        </div>

        {data ? (
          <>
            <h1 id="temp">{data.temp}°</h1>
            <h2>{description}</h2>
            <p>{data.date.toLocaleDateString('en-US', {weekday: 'long',day: '2-digit',month: 'long',year: 'numeric'})}</p>
          </>) : ("")}
      </section>
      {data?(<>
        <section id="discription">
          <h3> {data.date.toLocaleDateString('en-US')}</h3>
          <p class="details"> Max temperture :{data.max_temp}° </p>
          <p class="details"> Min temperture :{data.min_temp}° </p> 
          <h3 > { data.date.toLocaleString('en-US', {hour: '2-digit',minute: '2-digit',})}</h3>
          <div id="current">
            <p class="details" >Apparent temp :{data.apparent_temp}° </p>
             <p class="details">Humidity :{data.humidity}% </p> 
             <p class="details">Wind :{data.wind}km/h </p>
            <p class="details">Precipitation : {data.prec}%</p>
          </div>
       </section> 
      </>):("")}
    </div>
    </div>
   
  );
}

export default WeatherApp;
