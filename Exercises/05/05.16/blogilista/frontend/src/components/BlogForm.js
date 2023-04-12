import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        Title
        <input
          type="text"
          value={title}
          name="Title"
          onChange={event => setTitle(event.target.value)}
          placeholder='Blog title'
        />
        Author
        <input
          type="text"
          value={author}
          name="Author"
          onChange={event => setAuthor(event.target.value)}
          placeholder='Blog author'
        />
        Url
        <input
          type="text"
          value={url}
          name="Url"
          onChange={event => setUrl(event.target.value)}
          placeholder='Blog url'
        />
      </div>

      <button type="submit">Publish</button>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm