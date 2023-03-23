import { useState, useEffect } from 'react'
import countriesService from './services/countries'
import weatherService from './services/weather'

const App = () => {
  const [search, setSearch] = useState('')
  const [matchedCountry, setMatchedCountry] = useState(null)
  const [allCountries, setAllCountries] = useState({})
  const [weather, setWeather] = useState({})
  const [temperature, setTemperature] = useState(0)
  const [matchingCountries, setMatchingCountries] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)

  // Fetch data for all countries
  useEffect(() => {
    console.log('Fetching all countries')

    countriesService
      .getAll()
      .then(initialCountries => {
        setAllCountries(initialCountries)
      })
    console.log(`Fetched ${allCountries.length} countries`)
  }, [])

  const showNotification = (message) => {
    console.log("showNotification", message)
    setNotificationMessage(message)
  }

  const showCountryDetailsHandler = (country) => {
    console.log("showCountryDetailsHandler", country)
    showCountryDetails(country)
  }

  const showCountryDetails = (country) => {
    console.log("showCountryDetails", country)
    setMatchedCountry(allCountries.find(c => c.name.common.toLowerCase() === country.name.common.toLowerCase()))
    showCountryWeather(country)
  }

  const showCountryWeather = (country) => {
    console.log("showCountryWeather", country)
    weatherService
      .getLatLon(country.latlng[0], country.latlng[1])
      .then(weatherData => {
        console.log("showCountryWeather", weatherData)
        setWeather(weatherData)
        console.log(weatherData.main.temp)
        setTemperature(weatherData.main.temp)
      })
  }

  const handleSearchChange = (event) => {
    setNotificationMessage(null)
    setSearch(event.target.value)

    const matchedCountries = allCountries.filter(c => c.name.common.toLowerCase().includes(search))
    console.log(`Matched ${matchedCountries.length} countries`)

    if (matchedCountries.length > 10) {
      showNotification(`Too many search results`)
    } else if (matchedCountries.length > 1 && matchedCountries.length <= 10) {
      console.log("Showing up to 10")
      setMatchingCountries(matchedCountries)
    } else if (matchedCountries.length === 1) {
      console.log("Showing matched country")
      setMatchingCountries(matchedCountries)
      showCountryDetails(matchedCountries[0])
    } else {
      showNotification(`No results`)
      setMatchingCountries([])
    }
    
  }

  return (
    <div>
      Find countries: <input value={search} onChange={handleSearchChange} />
      <Notification message={notificationMessage} />
      {matchingCountries.map(c => <Country key={c.name.common} country={c} showCountryDetails={() => showCountryDetails(c)} />)}
      <CountryDetails country={matchedCountry} />
      <Weather capital={matchedCountry} temp={temperature}/>
    </div>
  )
}

const CountryDetails = ({ country }) => {
  console.log("CountryDetails", country)
  if (!country) {
    return null
  }
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital city is <b>{country.capital}</b></p>
      <p>The country covers an area of <b>{country.area}</b></p>
      <h2>Languages</h2>
      <ul>
        {Object.keys(country.languages).map((k, v) => <li key={k}>{country.languages[k]}</li>)}
      </ul>
      <img src={country.flags.png}></img>
    </div>
  )
}

const Weather = ({ capital, temp }) => {
  
  if (!capital || !temp) {
    return null
  }

  return (
    <div>
      <h2>Weather in {capital.capital}</h2>
      <p>Temperature {temp} Celcius</p>
    </div>
  )
}

const Country = ({ country, showCountryDetails }) => {
  return (
    <div>
      <p>{country.name.common} <button onClick={showCountryDetails} >Show</button></p>
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div>
      <p>{message}</p>
    </div>
  )
}

export default App;
