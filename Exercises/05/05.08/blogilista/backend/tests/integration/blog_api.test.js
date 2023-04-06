const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('../test_helper')
const Blog = require('../../src/models/blog')
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

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    await Blog.insertMany(helper.initialBlogs)
  })

  test('Blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('All blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)

    expect(contents).toContain(
      'Type wars'
    )
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
      const loginResponse = await api
        .post('/api/login')
        .send(helper.initialUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = loginResponse.body.token

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part I: Hello, World!',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(blog => blog.title)

      expect(titles).toContain('The Flask Mega-Tutorial Part I: Hello, World!')

      const users = blogsAtEnd.map(blog => blog.user ? blog.user.toString() : undefined)

      expect(users).toContain(loginResponse.body.id)
    })

    test('If likes are provided, the value is set correctly', async () => {
      let response = await api
        .post('/api/login')
        .send(helper.initialUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = response.body.token

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part II: Templates',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-ii-templates',
        likes: 6
      }

      response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      expect(response.body.likes).toBe(6)
    })

    test('If no likes are provided, they default to 0', async () => {
      const firstUser = await helper.firstUser()

      let response = await api
        .post('/api/login')
        .send(helper.initialUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = response.body.token

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part III: Web Forms',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-iii-web-forms',
        userId: firstUser.id
      }

      response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      expect(response.body.likes).toBe(0)
    })

    test('blog with missing title is rejected', async () => {
      const firstUser = await helper.firstUser()

      let response = await api
        .post('/api/login')
        .send(helper.initialUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = response.body.token

      const newBlog = {
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-iv-database',
        userId: firstUser.id
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })

    test('blog with missing url is rejected', async () => {
      const firstUser = await helper.firstUser()

      let response = await api
        .post('/api/login')
        .send(helper.initialUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = response.body.token

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part V: User Logins',
        author: 'Miguel Grinberg',
        userId: firstUser.id
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })

    test('POST request with missing token is rejected', async () => {
      const newBlog = {
        title: 'The Flask Mega-Tutorial Part VI: Profile Page and Avatars',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-vi-profile-page-and-avatars'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const firstUser = await helper.firstUser()

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part VII: Error Handling',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-vii-error-handling',
        userId: firstUser.id
      }

      let response = await api
        .post('/api/login')
        .send(helper.initialUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = response.body.token

      response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blog = response.body

      await api
        .delete(`/api/blogs/${blog.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      const titles = blogsAtEnd.map(blog => blog.title)

      expect(titles).not.toContain(blog.title)
    })

    test('fails with statuscode 404 if blog with id does not exist', async () => {
      let response = await api
        .post('/api/login')
        .send(helper.initialUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = response.body.token

      const validNonexistingId = await helper.nonExistingId()

      await api
        .delete(`/api/blogs/${validNonexistingId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('updating a blog', () => {
    test('Succeeds with status code 204 if id is valid', async () => {
      const firstUser = await helper.firstUser()

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part IX: Pagination',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-ix-pagination',
        userId: firstUser.id
      }

      let response = await api
        .post('/api/login')
        .send(helper.initialUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = response.body.token

      response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blog = response.body

      expect(blog.title).toContain(
        'The Flask Mega-Tutorial Part IX: Pagination'
      )

      const newLikes = 143

      const updatedBlog = {
        title: 'The Flask Mega-Tutorial Part IX: Pagination',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-ix-pagination',
        likes: newLikes
      }

      response = await api
        .put(`/api/blogs/${blog.id}`)
        .send(updatedBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const likes = blogsAtEnd.map(blog => blog.likes)

      expect(likes).toContain(updatedBlog.likes)
    })

    test('Failure with status code 404 if id is invalid', async () => {
      const firstUser = await helper.firstUser()

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part X: Email Support',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-x-email-support',
        userId: firstUser.id,
        likes: 947
      }

      let response = await api
        .post('/api/login')
        .send(helper.initialUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = response.body.token

      response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blog = response.body

      expect(blog.title).toContain(
        'The Flask Mega-Tutorial Part X: Email Support'
      )

      const newLikes = 143

      const updatedBlog = {
        title: 'The Flask Mega-Tutorial Part X: Email Support',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-x-email-support',
        likes: newLikes
      }

      const validNonexistingId = await helper.nonExistingId()

      response = await api
        .put(`/api/blogs/${validNonexistingId}`)
        .send(updatedBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const likes = blogsAtEnd.map(blog => blog.likes)

      expect(likes).toContain(947)
    })
  })
})


describe('/api/blogs GET', () => {

})

afterAll(async () => {
  await mongoose.connection.close()
})