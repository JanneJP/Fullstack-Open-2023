// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (max, blog) => {
    return max.likes > blog.likes ? max : blog
  }
  return blogs.length === 0
    ? null
    : blogs.reduce(reducer, { likes: 0 })
}

const mostBlogs = (blogs) => {
  const reducer = (count, blog) => {
    if (blog.author in count) {
      count[blog.author] += 1
    } else {
      count[blog.author] = 1
    }
    return count
  }

  if (blogs.length === 0) {
    return null
  }

  const count = blogs.reduce(reducer, {})

  const author = Object.keys(count).reduce((a, b) => count[a] > count[b] ? a : b)

  return { author: author, blogs: count[author] }
}

const mostLikes = (blogs) => {
  const reducer = (count, blog) => {
    if (blog.author in count) {
      count[blog.author] += blog.likes
    } else {
      count[blog.author] = blog.likes
    }
    return count
  }

  if (blogs.length === 0) {
    return null
  }

  const count = blogs.reduce(reducer, {})

  const author = Object.keys(count).reduce((a, b) => count[a] > count[b] ? a : b)

  return { author: author, likes: count[author] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}