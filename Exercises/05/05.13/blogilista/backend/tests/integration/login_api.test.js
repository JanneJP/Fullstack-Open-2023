const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../../src/app')
const User = require('../../src/models/user')

const api = supertest(app)

const initialUser = {
  username: 'login_test_user',
  name: 'login_test_user',
  password: 'login_test_password'
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

describe('POST requests', () => {
  test('Login with valid credentials will succeed with status code 200', async () => {
    const credentials = {
      username: initialUser.username,
      password: initialUser.password
    }

    const loginResponse = await api
      .post('/api/login')
      .send(credentials)

    expect(loginResponse.statusCode).toBe(200)
    expect(loginResponse.type).toBe('application/json')
    expect(loginResponse.body.username).toBe(initialUser.username)
    expect(loginResponse.body.name).toBe(initialUser.name)
    expect(loginResponse.body).toHaveProperty('id')
    expect(loginResponse.body).toHaveProperty('token')
  })

  test('Login with invalid credentials will fail with status code 401', async () => {
    let credentials = {
      username: initialUser.username,
      password: 'wrongpassword'
    }

    let loginResponse = await api
      .post('/api/login')
      .send(credentials)

    expect(loginResponse.statusCode).toBe(401)
    expect(loginResponse.type).toBe('application/json')
    expect(loginResponse.body.error).toBe('Invalid username or password')

    credentials = {
      username: 'doesnotexist',
      password: initialUser.password
    }

    loginResponse = await api
      .post('/api/login')
      .send(credentials)

    expect(loginResponse.statusCode).toBe(401)
    expect(loginResponse.type).toBe('application/json')
    expect(loginResponse.body.error).toBe('Invalid username or password')
  })

  test('Login with missing credential fields will fail with status code 400', async () => {
    let credentials = {
      username: initialUser.username,
    }

    let loginResponse = await api
      .post('/api/login')
      .send(credentials)

    expect(loginResponse.statusCode).toBe(400)
    expect(loginResponse.type).toBe('application/json')
    expect(loginResponse.body.error).toBe('Missing username or password')

    credentials = {
      password: initialUser.password
    }

    loginResponse = await api
      .post('/api/login')
      .send(credentials)

    expect(loginResponse.statusCode).toBe(400)
    expect(loginResponse.type).toBe('application/json')
    expect(loginResponse.body.error).toBe('Missing username or password')
  })
})

afterAll(async () => {
  await User.deleteMany({})

  await mongoose.connection.close()
})