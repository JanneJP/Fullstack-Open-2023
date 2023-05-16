const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 }).populate('comments', { message: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 }).populate('comments', { message: 1 })

  return blog ? response.json(blog) : response.status(404).json({ error: 'Resource not found' })
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)

  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  const oldBlog = await Blog.findById(request.params.id)

  const likedBlog = (oldBlog, newBlog) => {
    if (oldBlog.title === newBlog.title &&
        oldBlog.author === newBlog.author &&
        oldBlog.url === newBlog.url &&
        oldBlog.likes + 1 === newBlog.likes) {
      return true
    }
    return false
  }

  if (oldBlog === null) {
    return response.status(404).json({ error: 'Resource not found' })
  } else if (likedBlog(oldBlog, request.body)) {
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }

    await Blog.findByIdAndUpdate(oldBlog.id, blog, { new: true })

    return response.status(204).end()
  } else if ( oldBlog.user.toString() !== user._id.toString() ) {
    return response.status(403).json({ error: 'Not the owner' })
  } else {
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }

    if (!blog.title) {
      response.status(400).json({ error: 'Missing title' })
    } else if (!blog.author) {
      response.status(400).json({ error: 'Missing author' })
    } else if (!blog.url) {
      response.status(400).json({ error: 'Missing url' })
    }

    await Blog.findByIdAndUpdate(oldBlog.id, blog, { new: true })

    return response.status(204).end()
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findByIdAndRemove(request.params.id)

  if (blog === null) {
    response.status(404).json({ error: 'Resource not found' })
  } else if ( blog.user.toString() !== user._id.toString() ) {
    return response.status(403).json({ error: 'Not the owner' })
  } else {
    response.status(204).end()
  }
})

module.exports = blogsRouter