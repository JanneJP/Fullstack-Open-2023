const commentRouter = require('express').Router()
const Comment = require('../models/comment')
const middleware = require('../utils/middleware')

commentRouter.get('/', async (request, response) => {
  const comments = await Comment.find({}).populate('blog', { title: 1, author: 1, url: 1, likes: 1 })
  response.json(comments)
})

commentRouter.post('/', middleware.blogExtractor, async (request, response) => {
  const { message } = request.body
  const blog = request.blog

  const comment = new Comment({
    message: message,
    blog: blog._id
  })

  const savedComment = await comment.save()

  blog.comments = blog.comments.concat(savedComment._id)

  await blog.save()

  response.status(201).json(savedComment)
})

module.exports = commentRouter
