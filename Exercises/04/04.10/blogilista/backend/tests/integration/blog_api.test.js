const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('../test_helper')
const Blog = require('../../src/models/blog')
const app = require('../../src/app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
})

describe('Get Blogs', () => {
  test('are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns two blogs as result', async () => {
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
})

describe('Create Blogs', () => {
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'The Flask Mega-Tutorial Part I: Hello, World!',
      author: 'Miguel Grinberg',
      url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world'
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
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})