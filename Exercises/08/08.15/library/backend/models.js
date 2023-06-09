const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  published: {
    type: Number,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [
    { type: String}
  ]
})

bookSchema.plugin(uniqueValidator)

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  born: {
    type: Number,
  },
})

authorSchema.plugin(uniqueValidator)

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  favoriteGenre: {
    type: String,
    required: true
  }
})

userSchema.plugin(uniqueValidator)

module.exports = {
  authorModel: mongoose.model('Author', authorSchema),
  bookModel: mongoose.model('Book', bookSchema),
  userModel: mongoose.model('User', userSchema)
}