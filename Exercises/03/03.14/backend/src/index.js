require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

morgan.token('body', function(request, response) {
  if (request.method === "POST") {
    return JSON.stringify(request.body)
  } else {
    return null
  }
});

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response) => {
  if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
    response.status(404).end()
  } else {
    Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
  }
})

app.delete('/api/persons/:id', (request, response) => {
  // TODO

  response.status(404).end()
})

const generateId = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({error: 'Must provide name'})
  } else if (!body.number) {
    return response.status(400).json({error: 'Must provide number'})
  }

  Person.find({name: body.name}).then(person => {
    if (person.length > 0) {
      response.status(400).json({error: 'Name must be unique'})
    } else {
      const person = new Person({
        name: body.name,
        number: body.number
      })
    
      person.save().then(savedPerson => {
        response.json(savedPerson)
      })
    }
  })


})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})