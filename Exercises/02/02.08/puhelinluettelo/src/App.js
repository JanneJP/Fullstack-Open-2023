import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([])
 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

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
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <form onSubmit={addPerson}>
        <h2>Add new entry</h2>
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