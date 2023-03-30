require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

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

app.get('/info', (request, response, next) => {
  Person.find({}).then(people => {
    response.send(`<p>Phonebook has info for ${people.length} people.</p><p>${new Date()}</p>`)
  })
  .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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
  .catch(error => next(error))


})

const errorHandler = (error, request, response, next) => {
  console.log("aaaaaaaaaaaaaaa")
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})