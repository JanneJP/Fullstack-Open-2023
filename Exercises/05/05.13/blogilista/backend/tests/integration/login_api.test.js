const supertest = require('supertest')

const helper = require('../test_helper')
const User = require('../../src/models/user')
const app = require('../../src/app')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  await helper.createUser(helper.initialUser)
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
      username: 'root2',
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
      password: 'password2',
    }

    const response = await api
      .post('/api/login')
      .send(credentials)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('invalid username or password')
  })

  test('Login will fail with a missing password', async () => {
    const credentials = {
      username: helper.initialUser.username
    }

    const response = await api
      .post('/api/login')
      .send(credentials)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('Missing username or password')
  })

  test('Login will fail with a missing username', async () => {
    const credentials = {
      password: helper.initialUser.password
    }

    const response = await api
      .post('/api/login')
      .send(credentials)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('Missing username or password')
  })
})
