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
  reducer = (max, blog) => {
    return max.likes > blog.likes ? max : blog
  }
  return blogs.length === 0
    ? null
    : blogs.reduce(reducer, {likes: 0});
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}