import { useState, useEffect } from 'react'
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [searchName, setSearchName] = useState('')

  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
        .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  console.log('render', persons.length, 'persons')

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.filter(person => person.name.toLowerCase() === newName.toLowerCase()).length > 0) {
      console.log("Person with name", newName, "already exists in database")
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`) === true) {
        const personObject = {
          name: newName,
          number: newNumber
        }

        personsService
          .update(persons.find(person => person.name === newName).id, personObject)
          .then(returnedPerson => {
            setPersons(persons.filter(person => person.id !== returnedPerson.id).concat(returnedPerson))
            setNewName('')
            setNewNumber('')
            setSearchName('')
          })
        
        setErrorMessage(
          `Updated number for '${newName}' in the phonebook`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)


      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }

      personsService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setSearchName('')
        })
      
      setErrorMessage(
        `Added '${newName}' to the phonebook`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const deletePerson = (id) => {
    if (window.confirm(`Do you want to delete ${persons.find(person => person.id === id).name}`) === true)  {
      console.log(`Deleting ${persons.find(person => person.id === id).name}`)
      let deletingPersonName = persons.find(person => person.id === id).name
      personsService
        .del(id)
        .then(returnedPerson => {
          setPersons(persons.filter(person => person.id !== id))
        })
      
        setErrorMessage(
          `Deleted '${deletingPersonName}' from the phonebook`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
    } else {
      console.log("Deletion cancelled")
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
      <Notification message={errorMessage} />
      <InputField text="Filter for: " value={searchName} handler={handleSearchChange} />
      <h2>Add new</h2>
      <PersonForm formHandler={addPerson} nameField={{value: newName, handler: handleNameChange}} numberField={{value: newNumber, handler: handleNumberChange}} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deleteHandler={deletePerson}/>
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
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

const Persons = ({ persons, deleteHandler }) => {
  return (
    <div>
      {persons.map(person => <Person key={person.number} person={person} deletePerson={() => deleteHandler(person.id)} />)}
    </div>
  )
}

const Person = ({ person, deletePerson }) => {
  return (
    <div>
      <p>{person.name} ({person.number}) <button onClick={deletePerson} >Delete</button></p>
    </div>
  )
}

export default App