import axios from "axios";
const apiKey = import.meta.env.VITE_SOME_KEY;

const getWeather = (latlng) => {
  const request = axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latlng[0]}&lon=${latlng[1]}&appid=${apiKey}&units=metric`
  );
  return request.then((response) => response.data);
};

export default {
  getWeather,
};
