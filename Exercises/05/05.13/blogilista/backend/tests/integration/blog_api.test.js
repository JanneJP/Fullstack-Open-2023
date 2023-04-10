const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('../test_helper')
const Blog = require('../../src/models/blog')
const User = require('../../src/models/user')
const app = require('../../src/app')

const api = supertest(app)

let userId = null

const loginUser = async (userObject) => {
  const response = await api
    .post('/api/login')
    .send(userObject)

  userId = response.body.id

  return response
}

const publishBlog = async (blogObject, token) => {
  const response = await api
    .post('/api/blogs')
    .send(blogObject)
    .set('Authorization', `Bearer ${token}`)

  return response
}

beforeEach(async () => {
  await User.deleteMany({})

  await helper.createUser(helper.initialUser)
})

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    await helper.createBlog(helper.initialBlog)
  })

  test('Blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('All blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlog.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)

    expect(contents).toContain(helper.initialBlog.title)
  })

  test('contain a field called id', async () => {
    const response = await api.get('/api/blogs')

    const blog = response.body[0]

    expect(blog.id).toBeDefined()
  })

  describe('Viewing a spesific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(resultBlog.body).toEqual(blogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('Adding new blogs', () => {
    test('a valid blog can be added ', async () => {
      const loginResponse = await loginUser(helper.initialUser)

      const token = loginResponse.body.token

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part I: Hello, World!',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world'
      }

      const response = await publishBlog(newBlog, token)

      expect(response.statusCode).toBe(201)
      expect(response.type).toContain('application/json')

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlog.length + 1)

      expect(response.body.title).toBe('The Flask Mega-Tutorial Part I: Hello, World!')
      expect(response.body.author).toBe('Miguel Grinberg')
      expect(response.body.url).toBe('https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world')

      expect(response.body.user).toBe(userId)
    })

    test('If likes are provided, the value is set correctly', async () => {
      const loginResponse = await loginUser(helper.initialUser)

      const token = loginResponse.body.token

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part II: Templates',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-ii-templates',
        likes: 6
      }

      const response = await publishBlog(newBlog, token)

      expect(response.statusCode).toBe(201)
      expect(response.type).toContain('application/json')

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlog.length + 1)

      expect(response.body.likes).toBe(newBlog.likes)
    })

    test('If no likes are provided, they default to 0', async () => {
      const loginResponse = await loginUser(helper.initialUser)

      const token = loginResponse.body.token

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part III: Web Forms',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-iii-web-forms'
      }

      const response = await publishBlog(newBlog, token)

      expect(response.statusCode).toBe(201)
      expect(response.type).toContain('application/json')

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlog.length + 1)

      expect(response.body.likes).toBe(0)
    })

    test('blog with missing title is rejected', async () => {
      const loginResponse = await loginUser(helper.initialUser)

      const token = loginResponse.body.token

      const newBlog = {
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-iv-database'
      }

      const response = await publishBlog(newBlog, token)

      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe('Title required')
    })

    test('blog with missing url is rejected', async () => {
      const loginResponse = await loginUser(helper.initialUser)

      const token = loginResponse.body.token

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part V: User Logins',
        author: 'Miguel Grinberg'
      }

      const response = await publishBlog(newBlog, token)

      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe('Url required')
    })

    test('POST request with missing token is rejected', async () => {
      const newBlog = {
        title: 'The Flask Mega-Tutorial Part VI: Profile Page and Avatars',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-vi-profile-page-and-avatars'
      }

      const response = await publishBlog(newBlog, null)

      expect(response.statusCode).toBe(401)
      expect(response.body.error).toBe('Token missing or invalid')
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const loginResponse = await loginUser(helper.initialUser)

      const token = loginResponse.body.token

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part VII: Error Handling',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-vii-error-handling'
      }

      const response = await publishBlog(newBlog, token)

      const blogsAtMiddle = await helper.blogsInDb()

      expect(blogsAtMiddle).toHaveLength(helper.initialBlog.length + 1)

      await api
        .delete(`/api/blogs/${response.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlog.length)

      const titles = blogsAtEnd.map(blog => blog.title)

      expect(titles).not.toContain(newBlog.title)
    })

    test('fails with statuscode 404 if blog with id does not exist', async () => {
      const loginResponse = await loginUser(helper.initialUser)

      const token = loginResponse.body.token

      const validNonexistingId = await helper.nonExistingId()

      await api
        .delete(`/api/blogs/${validNonexistingId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlog.length)
    })

    test('fails with statuscode 404 if blog is not owned by the user', async () => {
      let loginResponse = await loginUser(helper.initialUser)

      let token = loginResponse.body.token

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part VII: Error Handling',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-vii-error-handling'
      }

      const response = await publishBlog(newBlog, token)

      expect(response.body.title).toBe(newBlog.title)
      expect(response.body.user).toBe(loginResponse.body.id)

      const newUser = {
        username: 'newuser',
        name: 'newuser',
        password: 'password'
      }

      await helper.createUser(newUser)

      loginResponse = await loginUser(newUser)

      expect(loginResponse.body.username).toBe(newUser.username)

      token = loginResponse.body.token

      const removalResponse = await api
        .delete(`/api/blogs/${response.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)

      expect(removalResponse.body.error).toBe('Not the owner')

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlog.length)
    })
  })

  describe('updating a blog', () => {
    test('Succeeds with status code 204 if id is valid', async () => {
      const loginResponse = await loginUser(helper.initialUser)

      const token = loginResponse.body.token

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part IX: Pagination',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-ix-pagination'
      }

      const response = await publishBlog(newBlog, token)

      const blogsAtMiddle = await helper.blogsInDb()

      expect(blogsAtMiddle).toHaveLength(helper.initialBlog.length + 1)

      expect(response.body.title).toBe('The Flask Mega-Tutorial Part IX: Pagination')

      const newLikes = 143

      const updatedBlog = {
        ...newBlog,
        likes: newLikes
      }

      const updateResponse = await api
        .put(`/api/blogs/${response.body.id}`)
        .send(updatedBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd.length).toBe(blogsAtMiddle.length)

      expect(updateResponse.body.likes).toBe(newLikes)
    })

    test('Failure with status code 404 if id is invalid', async () => {
      const loginResponse = await loginUser(helper.initialUser)

      const token = loginResponse.body.token

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part X: Email Support',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-x-email-support',
        likes: 947
      }

      const blogResponse = await publishBlog(newBlog, token)

      const blogsAtMiddle = await helper.blogsInDb()

      expect(blogsAtMiddle).toHaveLength(helper.initialBlog.length + 1)

      expect(blogResponse.body.title).toContain('The Flask Mega-Tutorial Part X: Email Support')

      const newLikes = 1337

      const updatedBlog = {
        ...newBlog,
        likes: newLikes
      }

      const validNonexistingId = await helper.nonExistingId()

      await api
        .put(`/api/blogs/${validNonexistingId}`)
        .send(updatedBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd.length).toBe(blogsAtMiddle.length)

      const likes = blogsAtEnd.map(blog => blog.likes)

      expect(likes).toContain(newBlog.likes)
    })
  })
})


describe('/api/blogs GET', () => {

})

afterAll(async () => {
  await mongoose.connection.close()
})