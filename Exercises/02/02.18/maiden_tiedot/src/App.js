import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [country, setCountry] = useState('')
  const [finalCountry, setFinalCountry] = useState(null)
  const [countries, setCountries] = useState({})
  const [selectedCountries, setSelectedCountries] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    console.log('Fetching all countries')

    axios
      .get(`https://restcountries.com/v3.1/all`)
      .then(response => {
        setCountries(response.data)
      })
      console.log("All countries", countries.length)
  }, [])

  const showNotification = (message) => {
    console.log(message)
    setNotificationMessage(message)
  }

  const handleChange = (event) => {
    setNotificationMessage(null)
    setCountry(event.target.value)
    let s = countries.filter(c => c.name.common.toLowerCase().includes(country))
    setFinalCountry(null)
    if (s.length > 10) {
      showNotification(`Too many search results`)
    } else if (s.length > 1 && s.length <= 10) {
      console.log("Showing 10")
      setSelectedCountries(s)
    } else if (s.length === 1) {
      console.log("Showing final")
      setSelectedCountries(s)
      setFinalCountry(countries.find(c => c.name.common.toLowerCase().includes(country)))
      console.log(finalCountry)
    } else {
      showNotification(`No results`)
    }
    
  }


  return (
    <div>
      Find countries: <input value={country} onChange={handleChange} />
      <Notification message={notificationMessage} />
      <pre>
        {selectedCountries.map(country => <Country key={country.name.common} country={country} />)}
      </pre>
      <FinalCountry country={finalCountry} />
    </div>
  )
}

const FinalCountry = ({ country }) => {
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
        {Object.keys(country.languages).map((k, v) => <li>{country.languages[k]}</li>)}
      </ul>
      <img src={country.flags.png}></img>
    </div>
  )
}

const Country = ({ country }) => {
  return (
    <div>
      <p>{country.name.common}</p>
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
