/* eslint-disable react/prop-types */
import { useState } from 'react'

const Blog = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  console.log(props.blog)

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        <p>{props.blog.title} <button onClick={toggleVisibility}>{props.buttonLabel}</button></p>
      </div>
      <div style={showWhenVisible}>
        <p>{props.blog.title} by {props.blog.author} <button onClick={toggleVisibility}>Hide</button></p>
        <p>{props.blog.url}</p>
        <p>Likes {props.blog.likes}</p>
      </div>
    </div>
  )
}

export default Blog