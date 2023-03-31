const mongoose = require('mongoose')

if (process.argv.length < 4) {

  console.log('Username and password required')
  process.exit(1)
}

const username = process.argv[2]
const password = process.argv[3]

const url = `mongodb+srv://${username}:${password}@mooc.v7sddbs.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 4) {
  console.log('Getting all people')

  Person.find({}).then(people => {
    console.log('Phonebook:')
    people.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()

    process.exit(1)
  })
} else if (process.argv.length === 6){

  const name = process.argv[4]
  const number = process.argv[5]

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {

  console.log('Provide name and number')
  process.exit(1)
}