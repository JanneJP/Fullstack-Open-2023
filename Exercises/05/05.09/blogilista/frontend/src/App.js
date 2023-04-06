import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  const [user, setUser] = useState(null)

  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const userJSON = window.localStorage.getItem('user')

    if (userJSON) {
      const u = JSON.parse(userJSON)
      setUser(u)
      console.log('Found in local storage', u)
      blogService.setToken(u.token)
    }
  }, [])

  useEffect(() => {
    const refreshBlogs = async () => {
      const b = await blogService.getAll()

      setBlogs(b)
    }
    if (user) {

      refreshBlogs()
    }

  }, [user])

  const flashNotification = (message) => {
    console.log(message)
    setNotificationMessage(message)
    setTimeout(() => {setNotificationMessage(null)}, 3000)
  }

  const flashError = (message, exception) => {
    setErrorMessage(message)
    console.error(exception)
    setTimeout(() => {setErrorMessage(null)}, 3000)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('login')
    window.localStorage.removeItem('user')
    setUser(null)
    flashNotification('Logged out')
  }

  const handleLogin = async (loginObject) => {
    try {
      const u = await loginService.login(loginObject)

      blogService.setToken(u.token)

      setUser(u)

      window.localStorage.setItem('user', JSON.stringify(u))
      console.log('Saving into local storage', u)

      flashNotification('Logged in')
    } catch (exception) {
      flashError('Wrong credentials', exception)
    }
  }

  const blogFormRef = useRef()

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      let returnedBlog = await blogService.create(blogObject)

      const u = await userService.getUser(returnedBlog.user)

      returnedBlog.user = u
      console.log(returnedBlog)
      setBlogs(blogs.concat(returnedBlog))

      flashNotification('New blog added')
    } catch (exception) {
      flashError('Something went wrong', exception)
    }
  }

  const loginForm = () => {
    return (
      <LoginForm handleLogin={handleLogin}/>
    )
  }

  const blogForm = () => {
    return (
      <Togglable buttonLabel='New Blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
    )
  }

  const showBlogs = () => {
    return (
      <div>
        {blogs.map(blog => <Blog key={blog.id} blog={blog} buttonLabel='Show'/>)}
      </div>
    )
  }

  return (
    <div>
      <Notification message={errorMessage} />
      <Notification message={notificationMessage} />
      {!user && loginForm()}
      {user && <div>
        <h2>blogs</h2>
        <p>{user.name} logged in <button type="button" onClick={handleLogout}>Logout</button></p>
        {blogForm()}
        {showBlogs()}
      </div>
      }
    </div>
  )
}

export default App