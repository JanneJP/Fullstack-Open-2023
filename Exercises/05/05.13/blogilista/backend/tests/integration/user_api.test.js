const supertest = require('supertest')

const helper = require('../test_helper')
const User = require('../../src/models/user')
const app = require('../../src/app')


const api = supertest(app)



describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    await helper.createUser(helper.initialUser)
  })

  test('Users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('All users are returned', async () => {
    const response = await api.get('/api/users')

    expect(response.body).toHaveLength(1)
  })

  test('Get spesific user', async () => {
    const response = await api.get('/api/users')
    const userId = response.body[0].id.toString()

    await api
      .get(`/api/users/${userId}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  describe('Creating new users', () => {
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'test_user',
        name: 'Test User',
        password: 'password',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'password',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('expected `username` to be unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is too short', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'a',
        name: 'Test User 2',
        password: 'password',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('`username` (`a`) is shorter than the minimum allowed length')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is too short', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'test_user_3',
        name: 'Test User 3',
        password: 'a',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('Password is too short')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'test_user_4',
        name: 'Test User 4'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('Password required')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        name: 'Test User 5',
        password: 'password'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('User validation failed: username: Path `username` is required.')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })
})