/* eslint-disable react/prop-types */
const BlogForm = ({
  title,
  author,
  url,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        Title
        <input
          type="text"
          value={title}
          name="Title"
          onChange={handleTitleChange}
        />
        Author
        <input
          type="text"
          value={author}
          name="Author"
          onChange={handleAuthorChange}
        />
        Url
        <input
          type="text"
          value={url}
          name="Url"
          onChange={handleUrlChange}
        />
      </div>

      <button type="submit">Publish</button>
    </form>
  )
}

export default BlogForm