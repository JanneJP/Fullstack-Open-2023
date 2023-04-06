/* eslint-disable react/prop-types */
import { useState } from 'react'

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
        />
        Author
        <input
          type="text"
          value={author}
          name="Author"
          onChange={event => setAuthor(event.target.value)}
        />
        Url
        <input
          type="text"
          value={url}
          name="Url"
          onChange={event => setUrl(event.target.value)}
        />
      </div>

      <button type="submit">Publish</button>
    </form>
  )
}

export default BlogForm