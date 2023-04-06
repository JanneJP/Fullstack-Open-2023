const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('../test_helper')
const User = require('../../src/models/user')
const app = require('../../src/app')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  await api
    .post('/api/users')
    .send(helper.initialUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)
})

describe('When there is a valid user in database', () => {
  test('Login will be successful', async () => {
    const credentials = {
      username: helper.initialUser.username,
      password: helper.initialUser.password,
    }

    const response = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveProperty('token')
  })

  test('Login will fail with invalid username', async () => {
    const credentials = {
      username: 'test3',
      password: helper.initialUser.password,
    }

    const response = await api
      .post('/api/login')
      .send(credentials)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('invalid username or password')
  })

  test('Login will fail with invalid password', async () => {
    const credentials = {
      username: helper.initialUser.username,
      password: 'aaaaaa',
    }

    const response = await api
      .post('/api/login')
      .send(credentials)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('invalid username or password')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})