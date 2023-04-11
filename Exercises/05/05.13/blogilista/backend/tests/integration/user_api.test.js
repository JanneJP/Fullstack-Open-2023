const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../../src/app')
const User = require('../../src/models/user')
const Blog = require('../../src/models/blog')

const api = supertest(app)

const initialUser = {
  username: 'user_test_user',
  name: 'user_test_user',
  password: 'user_test_password'
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'a', author: 'b', url: 'c' })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

beforeEach(async () => {
  await User.deleteMany({})

  const user = new User({
    username: initialUser.username,
    name: initialUser.name,
    passwordHash: await bcrypt.hash(initialUser.password, 10)
  })

  await user.save()
})

describe('GET /api/users requests', () => {
  test('Users are returned in correct format with status code 200', async () => {
    const userResponse = await api
      .get('/api/users')

    expect(userResponse.statusCode).toBe(200)
    expect(userResponse.type).toBe('application/json')
    expect(userResponse.body.length).toBe(1)

    const user = userResponse.body[0]

    expect(user.username).toBe(initialUser.username)
    expect(user).toHaveProperty('id')
  })
})

describe('GET /api/users/:id requests', () => {
  test('Individual users are returned in correct format with status code 200', async () => {
    let userResponse = await api
      .get('/api/users')

    expect(userResponse.statusCode).toBe(200)
    expect(userResponse.type).toBe('application/json')
    expect(userResponse.body.length).toBe(1)

    let user = userResponse.body[0]

    userResponse = await api
      .get(`/api/users/${user.id}`)

    expect(userResponse.statusCode).toBe(200)
    expect(userResponse.type).toBe('application/json')

    user = userResponse.body

    expect(user.username).toBe(initialUser.username)
    expect(user.name).toBe(initialUser.name)
    expect(user).toHaveProperty('id')
  })

  test('Requests with invalid ID are responded to with status code 404', async () => {
    const userId = await nonExistingId()

    const userResponse = await api
      .get(`/api/users/${userId}`)

    expect(userResponse.statusCode).toBe(404)
    expect(userResponse.type).toBe('application/json')
    expect(userResponse.body.error).toBe('Resource not found')
  })
})

describe('POST requests', () => {
  test('New user with valid unique credentials can be created', async () => {
    const newUser = {
      username: 'new_user',
      name: 'new_user',
      password: 'password'
    }

    const createUserResponse = await api
      .post('/api/users')
      .send(newUser)

    expect(createUserResponse.statusCode).toBe(201)
    expect(createUserResponse.type).toBe('application/json')

    const createdUser = createUserResponse.body

    expect(createdUser.username).toBe(newUser.username)
    expect(createdUser.name).toBe(newUser.name)
    expect(createdUser).toHaveProperty('id')
  })

  describe('Invalid or missing fields are handled correctly', () => {
    // Password

    test('Missing password is rejected with status code 400', async () => {
      const newUser = {
        username: 'new_user',
        name: 'new_user',
      }

      const createUserResponse = await api
        .post('/api/users')
        .send(newUser)

      expect(createUserResponse.statusCode).toBe(400)
      expect(createUserResponse.type).toBe('application/json')
      expect(createUserResponse.body.error).toBe('Password required')
    })

    // Name

    test('Missing name is rejected with status code 400', async () => {
      const newUser = {
        username: 'new_user',
        password: 'password'
      }

      const createUserResponse = await api
        .post('/api/users')
        .send(newUser)

      expect(createUserResponse.statusCode).toBe(400)
      expect(createUserResponse.type).toBe('application/json')
      expect(createUserResponse.body.error).toBe('User validation failed: name: Path `name` is required.')
    })

    test('Short name is rejected with status code 400', async () => {
      const newUser = {
        username: 'new_user',
        name: 'n',
        password: 'password'
      }

      const createUserResponse = await api
        .post('/api/users')
        .send(newUser)

      expect(createUserResponse.statusCode).toBe(400)
      expect(createUserResponse.type).toBe('application/json')
      expect(createUserResponse.body.error).toContain('is shorter than the minimum allowed length')
    })

    // Username

    test('Missing username is rejected with status code 400', async () => {
      const newUser = {
        name: 'new_user',
        password: 'password'
      }

      const createUserResponse = await api
        .post('/api/users')
        .send(newUser)

      expect(createUserResponse.statusCode).toBe(400)
      expect(createUserResponse.type).toBe('application/json')
      expect(createUserResponse.body.error).toBe('User validation failed: username: Path `username` is required.')
    })

    test('Short username is rejected with status code 400', async () => {
      const newUser = {
        username: 'n',
        name: 'new_user',
        password: 'password'
      }

      const createUserResponse = await api
        .post('/api/users')
        .send(newUser)

      expect(createUserResponse.statusCode).toBe(400)
      expect(createUserResponse.type).toBe('application/json')
      expect(createUserResponse.body.error).toContain('is shorter than the minimum allowed length')
    })

    test('Non unique username is rejected with status code 400', async () => {
      const newUser = {
        username: 'user_test_user',
        name: 'user_test_user',
        password: 'user_test_password'
      }

      const createUserResponse = await api
        .post('/api/users')
        .send(newUser)

      expect(createUserResponse.statusCode).toBe(400)
      expect(createUserResponse.type).toBe('application/json')
      expect(createUserResponse.body.error).toContain('to be unique.')
    })
  })
})

afterAll(async () => {
  await User.deleteMany({})

  await mongoose.connection.close()
})