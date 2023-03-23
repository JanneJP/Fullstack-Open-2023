import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [searchName, setSearchName] = useState('')

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
      <div>
        Filter for: <input
          value={searchName}
          onChange={handleSearchChange}
        />
      </div>
      <form onSubmit={addPerson}>
        <h2>Add new</h2>
        <div>
          Name: <input
            value={newName}
            onChange={handleNameChange}
          />
          </div>
          <div>
          Number: <input
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
        {personsToShow.map(person => <Person key={person.number} person={person} />)}
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