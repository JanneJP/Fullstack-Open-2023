import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const likeBlog = () => {
    props.likeBlog(props.blog)
  }

  const removeBlog = () => {
    props.removeBlog(props.blog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        <p>{props.blog.title} <button onClick={toggleVisibility}>{props.buttonLabel}</button></p>
      </div>
      <div style={showWhenVisible}>
        <p>{props.blog.title} by {props.blog.author} <button onClick={toggleVisibility}>Hide</button></p>
        <p>{props.blog.url}</p>
        <p>Likes {props.blog.likes} <button onClick={likeBlog}>Like</button></p>
        <p>{props.blog.user.username}</p>
        {props.user.id === props.blog.user.id &&
          <button onClick={removeBlog}>Remove</button>
        }
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  removeBlog: PropTypes.func.isRequired,
  likeBlog: PropTypes.func.isRequired
}

export default Blog