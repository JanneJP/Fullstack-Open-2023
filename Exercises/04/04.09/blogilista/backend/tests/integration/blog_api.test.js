const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('../test_helper')
const Blog = require('../../src/models/blog')
const app = require('../../src/app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

describe('Blogs', () => {
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

afterAll(async () => {
  await mongoose.connection.close()
})