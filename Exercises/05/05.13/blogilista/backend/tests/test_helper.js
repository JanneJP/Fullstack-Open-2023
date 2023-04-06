const bcrypt = require('bcrypt')

const Blog = require('../src/models/blog')
const User = require('../src/models/user')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }, {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 7
  }
]

const initialUser = {
  username: 'root',
  name: 'superuser',
  password: 'password'
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const firstUser = async () => {
  const users = await User.find({})

  return users[0].toJSON()
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'a', author: 'b', url: 'c' })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const createUser = async (userObject) => {
  const user = new User({
    username: userObject.username,
    name: userObject.name,
    passwordHash: await bcrypt.hash(userObject.password, 10)
  })

  await user.save()
}

module.exports = {
  initialBlogs,
  initialUser,
  firstUser,
  nonExistingId,
  blogsInDb,
  usersInDb,
  createUser
}