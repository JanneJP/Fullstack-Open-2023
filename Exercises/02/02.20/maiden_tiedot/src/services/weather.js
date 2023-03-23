import axios from 'axios'
const baseUrl = 'https://api.openweathermap.org/data/2.5/'
const api_key = process.env.WEATHER_API_KEY

const getLatLon = (lat, lon) => {
  console.log("getLatLon")
  const request = axios.get(`${baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`)
  return request.then(response => response.data)
}

export default { getLatLon }