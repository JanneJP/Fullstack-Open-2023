import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    console.log('effect')

    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])

  console.log('render', persons.length, 'persons')

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.filter(person => person.name.toLowerCase() === newName.toLowerCase()).length > 0) {
      alert(`${newName} is already added to phonebook`)
    } else if (persons.filter(person => person.number === newNumber).length > 0) {
      alert(`${newNumber} is already added to phonebook`)
    } else {
      const nameObject = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewNumber('')
      setSearchName('')
    }
  }

  const personsToShow = searchName ? persons.filter(person => person.name.toLowerCase().includes(searchName)) : persons

  const handleSearchChange = (event) => {
    console.log("handleSearchChange", event.target.value)
    setSearchName(event.target.value)
  }

  const handleNameChange = (event) => {
    console.log("handleNameChange", event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log("handleNumberChange", event.target.value)
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <InputField text="Filter for: " value={searchName} handler={handleSearchChange} />
      <h2>Add new</h2>
      <PersonForm formHandler={addPerson} nameField={{value: newName, handler: handleNameChange}} numberField={{value: newNumber, handler: handleNumberChange}} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow}/>
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <div>
      <form onSubmit={props.formHandler}>
        <InputField text="Name: " value={props.nameField.value} handler={props.nameField.handler} />
        <InputField text="Number: " value={props.numberField.value} handler={props.numberField.handler} />
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const InputField = ({ text, value, handler }) => {
  return (
    <div>
      {text}<input value={value} onChange={handler} />
    </div>
  )
}

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map(person => <Person key={person.number} person={person} />)}
    </div>
  )
}

const Person = ({ person }) => {
  return (
    <div>
      <p>{person.name} ({person.number})</p>
    </div>
  )
}

export default App