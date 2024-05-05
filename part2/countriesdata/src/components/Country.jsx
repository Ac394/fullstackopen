import { useState, useEffect } from "react";
import weatherService from "../services/weather";

const Country = ({ country }) => {
  const [isLoading, setLoading] = useState(true);
  const [weather, setWeather] = useState("");

  useEffect(() => {
    weatherService.getWeather(country.latlng).then((weather) => {
      console.log(weather);
      setWeather(weather);
      setLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>capital {country.capital[0]}</p>
        <p>area {country.area}</p>
        <h3>languages:</h3>
        <ul>
          {Object.values(country.languages).map((language, i) => (
            <li key={i}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.svg} />
      </div>
    );
  } else
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>capital {country.capital[0]}</p>
        <p>area {country.area}</p>
        <h3>languages:</h3>
        <ul>
          {Object.values(country.languages).map((language, i) => (
            <li key={i}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.svg} />
        <h2>Weather in {country.capital[0]}</h2>
        <p>temperature: {weather.main.temp} Celsius</p>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        />
        <p>wind: {weather.wind.speed} m/s</p>
      </div>
    );
};
export default Country;
