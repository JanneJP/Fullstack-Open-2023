import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import userService from './services/users'
import loginService from './services/login'

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
    const getUserBlogs = async () => {
      const b = await userService.getUser(user.id)

      setBlogs(b.blogs)
    }
    if (user) {

      getUserBlogs()
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

      const b = await userService.getUser(u.id)

      setBlogs(b.blogs)

      window.localStorage.setItem('user', JSON.stringify(u))
      console.log('Saving into local storage', u)

      flashNotification('Logged in')
    } catch (exception) {
      flashError('Wrong credentials', exception)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

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
      <Togglable buttonLabel='New Blog'>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
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
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
      }
    </div>
  )
}

export default App