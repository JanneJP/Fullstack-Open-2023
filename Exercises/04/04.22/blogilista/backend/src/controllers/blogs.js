const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  return blog ? response.json(blog) : response.status(404).end()
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!body.title) {
    return response.status(400).json({ error: 'Title required' })
  }

  if (!body.url) {
    return response.status(400).json({ error: 'Url required' })
  }

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

  if (oldBlog === null) {
    response.status(404).end()
  } else if ( oldBlog.user.toString() !== user._id.toString() ) {
    return response.status(403).json({ error: 'Not the owner' })
  } else {
    response.status(204).end()
  }

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(oldBlog.id, blog, { new: true })

  response.status(204).json(updatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findByIdAndRemove(request.params.id)

  if (blog === null) {
    response.status(404).end()
  } else if ( blog.user.toString() !== user._id.toString() ) {
    return response.status(403).json({ error: 'Not the owner' })
  } else {
    response.status(204).end()
  }
})

module.exports = blogsRouter