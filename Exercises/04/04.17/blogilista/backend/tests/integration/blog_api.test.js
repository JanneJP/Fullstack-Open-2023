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
      const firstUser = await helper.firstUser()

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part I: Hello, World!',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world',
        userId: firstUser.id
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const contents = blogsAtEnd.map(blog => blog.title)
      expect(contents).toContain(
        'The Flask Mega-Tutorial Part I: Hello, World!'
      )

      const users = blogsAtEnd.map(blog => blog.user ? blog.user.toString() : undefined)

      expect(users).toContain(firstUser.id)
    })

    test('If likes are provided, the value is set correctly', async () => {
      const firstUser = await helper.firstUser()

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part II: Templates',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-ii-templates',
        likes: 6,
        userId: firstUser.id
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(response.body.likes).toBe(6)
    })

    test('If no likes are provided, they default to 0', async () => {
      const firstUser = await helper.firstUser()

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part III: Web Forms',
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-iii-web-forms',
        userId: firstUser.id
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(response.body.likes).toBe(0)
    })

    test('blog with missing title is rejected', async () => {
      const firstUser = await helper.firstUser()

      const newBlog = {
        author: 'Miguel Grinberg',
        url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-iv-database',
        userId: firstUser.id
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })

    test('blog with missing url is rejected', async () => {
      const firstUser = await helper.firstUser()

      const newBlog = {
        title: 'The Flask Mega-Tutorial Part V: User Logins',
        author: 'Miguel Grinberg',
        userId: firstUser.id
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(blog => blog.title)

      expect(titles).not.toContain(blogToDelete.title)
    })

    test('fails with statuscode 404 if blog with id does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .delete(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })
  })

  describe('updating a blog', () => {
    test('Succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      blogToUpdate.likes = blogsAtStart[0].likes + 100

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      const likes = blogsAtEnd.map(blog => blog.likes)

      expect(likes).toContain(blogToUpdate.likes)
    })
  })
})


describe('/api/blogs GET', () => {

})

afterAll(async () => {
  await mongoose.connection.close()
})