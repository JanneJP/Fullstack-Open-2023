const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../../src/app')
const User = require('../../src/models/user')
const Blog = require('../../src/models/blog')

const api = supertest(app)

let initialUserToken = null
let initialBlogId = null

const initialUser = {
  username: 'blog_test_user',
  name: 'blog_test_user',
  password: 'blog_test_password'
}

const initialBlog = {
  title: 'Test blog',
  author: 'Test blog',
  url: 'http://www.example.com'
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

  const loginResponse = api
    .post('/api/login')
    .send(initialUser)

  initialUserToken = (await loginResponse).body.token

  await Blog.deleteMany({})

  const blog = new Blog({
    title: initialBlog.title,
    author: initialBlog.author,
    url: initialBlog.url,
    user: user.id.toString()
  })

  await blog.save()

  initialBlogId = blog.id
})

describe('GET /api/blogs requests', () => {
  test('Blogs are returned in correct format with status code 200', async () => {
    const blogResponse = await api
      .get('/api/blogs')

    expect(blogResponse.statusCode).toBe(200)
    expect(blogResponse.type).toBe('application/json')
    expect(blogResponse.body.length).toBe(1)

    const blog = blogResponse.body[0]

    expect(blog.title).toBe(initialBlog.title)
    expect(blog.author).toBe(initialBlog.author)
    expect(blog.url).toBe(initialBlog.url)
    expect(blog).toHaveProperty('id')
    expect(blog.user).toHaveProperty('username')
  })
})

describe('GET /api/blogs/:id requests', () => {
  test('Individual blogs are returned in correct format with status code 200', async () => {
    const blogResponse = await api
      .get(`/api/blogs/${initialBlogId}`)

    expect(blogResponse.statusCode).toBe(200)
    expect(blogResponse.type).toBe('application/json')

    const blog = blogResponse.body

    expect(blog.title).toBe(initialBlog.title)
    expect(blog.author).toBe(initialBlog.author)
    expect(blog.url).toBe(initialBlog.url)
    expect(blog).toHaveProperty('id')
    expect(blog.user).toHaveProperty('username')
  })

  describe('Invalid or missing id is handled correctly', () => {
    test('Requests with valid id, but no matching resource are responded to with status code 404', async () => {
      const blogId = await nonExistingId()

      const blogResponse = await api
        .get(`/api/blogs/${blogId}`)

      expect(blogResponse.statusCode).toBe(404)
      expect(blogResponse.type).toBe('application/json')
      expect(blogResponse.body.error).toBe('Resource not found')
    })

    test('Requests with invalid id are responded to with status code 400', async () => {
      const blogId = 'invalid'

      const blogResponse = await api
        .get(`/api/blogs/${blogId}`)

      expect(blogResponse.statusCode).toBe(400)
      expect(blogResponse.type).toBe('application/json')
      expect(blogResponse.body.error).toBe('Malformatted id')
    })
  })
})

describe('POST /api/blogs requests', () => {
  test('New blog with valid fields can be created', async () => {
    const newBlog = {
      title: 'New test blog',
      author: 'Test author',
      url: 'Test url'
    }

    const createBlogResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${initialUserToken}`)

    expect(createBlogResponse.statusCode).toBe(201)
    expect(createBlogResponse.type).toBe('application/json')

    const blog = createBlogResponse.body

    expect(blog.title).toBe(newBlog.title)
    expect(blog.author).toBe(newBlog.author)
    expect(blog.url).toBe(newBlog.url)
    expect(blog.likes).toBe(0)
    expect(blog).toHaveProperty('id')
    expect(blog).toHaveProperty('user')
  })

  test('Likes are set if the property is provided', async () => {
    const newBlog = {
      title: 'New test blog',
      author: 'Test author',
      url: 'Test url',
      likes: 999
    }

    const createBlogResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${initialUserToken}`)

    expect(createBlogResponse.statusCode).toBe(201)
    expect(createBlogResponse.type).toBe('application/json')

    const blog = createBlogResponse.body

    expect(blog.title).toBe(newBlog.title)
    expect(blog.author).toBe(newBlog.author)
    expect(blog.url).toBe(newBlog.url)
    expect(blog.likes).toBe(999)
    expect(blog).toHaveProperty('id')
    expect(blog).toHaveProperty('user')
  })

  describe('Invalid or missing fields are handled correctly', () => {
    test('Missing title is rejected with status code 400', async () => {
      const newBlog = {
        author: 'Test author',
        url: 'Test url'
      }

      const createBlogResponse = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${initialUserToken}`)

      expect(createBlogResponse.statusCode).toBe(400)
      expect(createBlogResponse.type).toBe('application/json')
      expect(createBlogResponse.body.error).toContain('is required.')
    })

    test('Missing author is rejected with status code 400', async () => {
      const newBlog = {
        title: 'Test title',
        url: 'Test url'
      }

      const createBlogResponse = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${initialUserToken}`)

      expect(createBlogResponse.statusCode).toBe(400)
      expect(createBlogResponse.type).toBe('application/json')
      expect(createBlogResponse.body.error).toContain('is required.')
    })

    test('Missing url is rejected with status code 400', async () => {
      const newBlog = {
        title: 'Test title',
        author: 'Test author'
      }

      const createBlogResponse = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${initialUserToken}`)

      expect(createBlogResponse.statusCode).toBe(400)
      expect(createBlogResponse.type).toBe('application/json')
      expect(createBlogResponse.body.error).toContain('is required.')
    })

    describe('Missing or invalid token is handled correctly', () => {
      test('Missing token is rejected with status code 401', async () => {
        const newBlog = {
          title: 'Test title',
          author: 'Test author',
          url: 'Test url'
        }

        const createBlogResponse = await api
          .post('/api/blogs')
          .send(newBlog)

        expect(createBlogResponse.statusCode).toBe(401)
        expect(createBlogResponse.type).toBe('application/json')
        expect(createBlogResponse.body.error).toContain('Token missing or invalid')
      })

      test('Invalid token is rejected with status code 401', async () => {
        const newBlog = {
          title: 'Test title',
          author: 'Test author',
          url: 'Test url'
        }

        const createBlogResponse = await api
          .post('/api/blogs')
          .send(newBlog)
          .set('Authorization', 'Bearer aaaaaaaaaaaa')

        expect(createBlogResponse.statusCode).toBe(401)
        expect(createBlogResponse.type).toBe('application/json')
        expect(createBlogResponse.body.error).toContain('Token missing or invalid')
      })
    })

  })
})

describe('DELETE /api/blogs requests', () => {
  test('An existing blog can be deleted by its owner, responds with status code 204', async () => {
    const deletedBlogResponse = await api
      .delete(`/api/blogs/${initialBlogId}`)
      .set('Authorization', `Bearer ${initialUserToken}`)

    expect(deletedBlogResponse.statusCode).toBe(204)
  })

  test('A blog cant be deleted by other users', async () => {
    const credentials = {
      username: 'seconduser',
      name: 'seconduser',
      password: 'password'
    }

    const user = new User({
      username: credentials.username,
      name: credentials.name,
      passwordHash: await bcrypt.hash(credentials.password, 10)
    })

    await user.save()

    const loginResponse = api
      .post('/api/login')
      .send(credentials)

    const token = (await loginResponse).body.token

    const deletedBlogResponse = await api
      .delete(`/api/blogs/${initialBlogId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(deletedBlogResponse.statusCode).toBe(403)
    expect(deletedBlogResponse.body.error).toBe('Not the owner')
  })

  describe('Invalid or missing id is handled correctly', () => {
    test('Requests with valid id, but no matching resource are responded to with status code 404', async () => {
      const blogId = await nonExistingId()

      const blogResponse = await api
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${initialUserToken}`)

      expect(blogResponse.statusCode).toBe(404)
      expect(blogResponse.type).toBe('application/json')
      expect(blogResponse.body.error).toBe('Resource not found')
    })

    test('Requests with invalid id are responded to with status code 400', async () => {
      const blogId = 'invalid'

      const blogResponse = await api
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${initialUserToken}`)

      expect(blogResponse.statusCode).toBe(400)
      expect(blogResponse.type).toBe('application/json')
      expect(blogResponse.body.error).toBe('Malformatted id')
    })
  })

  describe('Missing or invalid token is handled correctly', () => {
    test('Missing token is rejected with status code 401', async () => {
      const createBlogResponse = await api
        .delete(`/api/blogs/${initialBlogId}`)

      expect(createBlogResponse.statusCode).toBe(401)
      expect(createBlogResponse.type).toBe('application/json')
      expect(createBlogResponse.body.error).toContain('Token missing or invalid')
    })

    test('Invalid token is rejected with status code 401', async () => {
      const createBlogResponse = await api
        .delete(`/api/blogs/${initialBlogId}`)
        .set('Authorization', 'Bearer aaaaaaaaaaaa')

      expect(createBlogResponse.statusCode).toBe(401)
      expect(createBlogResponse.type).toBe('application/json')
      expect(createBlogResponse.body.error).toContain('Token missing or invalid')
    })
  })
})

describe('PUT /api/blogs/:id requests', () => {
  test('Blog with valid id and fields can be updated', async () => {
    const updatedBlog = {
      title: initialBlog.title,
      author: initialBlog.author,
      url: 'New Test Url'
    }

    const updateBlogResponse = await api
      .put(`/api/blogs/${initialBlogId}`)
      .send(updatedBlog)
      .set('Authorization', `Bearer ${initialUserToken}`)

    expect(updateBlogResponse.statusCode).toBe(204)

    const blogResponse = await api
      .get(`/api/blogs/${initialBlogId}`)

    const blog = blogResponse.body

    expect(blog.title).toBe(updatedBlog.title)
    expect(blog.author).toBe(updatedBlog.author)
    expect(blog.url).toBe(updatedBlog.url)
    expect(blog.likes).toBe(0)
    expect(blog).toHaveProperty('id')
    expect(blog).toHaveProperty('user')
  })

  test('A blog cant be updated by other users', async () => {
    const credentials = {
      username: 'seconduser',
      name: 'seconduser',
      password: 'password'
    }

    const user = new User({
      username: credentials.username,
      name: credentials.name,
      passwordHash: await bcrypt.hash(credentials.password, 10)
    })

    await user.save()

    const loginResponse = api
      .post('/api/login')
      .send(credentials)

    const token = (await loginResponse).body.token

    const updatedBlog = {
      title: initialBlog.title,
      author: initialBlog.author,
      url: 'New Test Url'
    }

    const updatedBlogResponse = await api
      .put(`/api/blogs/${initialBlogId}`)
      .send(updatedBlog)
      .set('Authorization', `Bearer ${token}`)

    expect(updatedBlogResponse.statusCode).toBe(403)
    expect(updatedBlogResponse.body.error).toBe('Not the owner')
  })

  test('A blog can be liked by other users', async () => {
    const credentials = {
      username: 'seconduser',
      name: 'seconduser',
      password: 'password'
    }

    const user = new User({
      username: credentials.username,
      name: credentials.name,
      passwordHash: await bcrypt.hash(credentials.password, 10)
    })

    await user.save()

    const loginResponse = api
      .post('/api/login')
      .send(credentials)

    const token = (await loginResponse).body.token

    const updatedBlog = {
      title: initialBlog.title,
      author: initialBlog.author,
      url: initialBlog.url,
      likes: 1
    }

    const updatedBlogResponse = await api
      .put(`/api/blogs/${initialBlogId}`)
      .send(updatedBlog)
      .set('Authorization', `Bearer ${token}`)

    expect(updatedBlogResponse.statusCode).toBe(204)
  })

  describe('Missing or invalid fields are handled correctly', () => {
    test('Missing title is rejected with status code 400', async () => {
      const updatedBlog = {
        author: 'sfasfasf',
        url: 'assaf'
      }

      const blogResponse = await api
        .put(`/api/blogs/${initialBlogId}`)
        .send(updatedBlog)
        .set('Authorization', `Bearer ${initialUserToken}`)

      expect(blogResponse.statusCode).toBe(400)
      expect(blogResponse.type).toBe('application/json')
      expect(blogResponse.body.error).toContain('Missing title')
    })

    test('Missing author is rejected with status code 400', async () => {
      const updatedBlog = {
        title: 'aaadad',
        url: 'addaad'
      }

      const blogResponse = await api
        .put(`/api/blogs/${initialBlogId}`)
        .send(updatedBlog)
        .set('Authorization', `Bearer ${initialUserToken}`)

      expect(blogResponse.statusCode).toBe(400)
      expect(blogResponse.type).toBe('application/json')
      expect(blogResponse.body.error).toContain('Missing author')
    })

    test('Missing url is rejected with status code 400', async () => {
      const updatedBlog = {
        title: 'adaadad',
        author: 'afafaafs',
      }

      const blogResponse = await api
        .put(`/api/blogs/${initialBlogId}`)
        .send(updatedBlog)
        .set('Authorization', `Bearer ${initialUserToken}`)

      expect(blogResponse.statusCode).toBe(400)
      expect(blogResponse.type).toBe('application/json')
      expect(blogResponse.body.error).toContain('Missing url')
    })
  })

  describe('Missing or invalid token is handled correctly', () => {
    test('Missing token is rejected with status code 401', async () => {
      const blogResponse = await api
        .put(`/api/blogs/${initialBlogId}`)

      expect(blogResponse.statusCode).toBe(401)
      expect(blogResponse.type).toBe('application/json')
      expect(blogResponse.body.error).toContain('Token missing or invalid')
    })

    test('Invalid token is rejected with status code 401', async () => {
      const blogResponse = await api
        .put(`/api/blogs/${initialBlogId}`)
        .set('Authorization', 'Bearer aaaaaaaaaaaa')

      expect(blogResponse.statusCode).toBe(401)
      expect(blogResponse.type).toBe('application/json')
      expect(blogResponse.body.error).toContain('Token missing or invalid')
    })
  })

  describe('Invalid or missing id is handled correctly', () => {
    test('Requests with valid id, but no matching resource are responded to with status code 404', async () => {
      const blogId = await nonExistingId()

      const blogResponse = await api
        .put(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${initialUserToken}`)

      expect(blogResponse.statusCode).toBe(404)
      expect(blogResponse.type).toBe('application/json')
      expect(blogResponse.body.error).toBe('Resource not found')
    })

    test('Requests with invalid id are responded to with status code 400', async () => {
      const blogId = 'aaaaaaa'

      const blogResponse = await api
        .put(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${initialUserToken}`)

      expect(blogResponse.statusCode).toBe(400)
      expect(blogResponse.type).toBe('application/json')
      expect(blogResponse.body.error).toBe('Malformatted id')
    })
  })
})

afterAll(async () => {
  await User.deleteMany({})

  await mongoose.connection.close()
})