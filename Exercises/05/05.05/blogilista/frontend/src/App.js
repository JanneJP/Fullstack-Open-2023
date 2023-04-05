import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import userService from './services/users'
import loginService from './services/login'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const userJSON = window.localStorage.getItem('user')

    if (userJSON && userJSON !== 'null') {
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

  const handleLogout = () => {
    loginService.logout()
    setUser(null)
    setNotificationMessage('Logged out')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      await blogService.create({ title, author, url })

      const b = await userService.getUser(user.id)

      setBlogs(b.blogs)
      setNotificationMessage('New blog added')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (exception) {
      let message = exception.message
      if (exception.response) {
        message = exception.response.data.error
      }
      console.log(message)
      setErrorMessage(message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const u = await loginService.login({ username, password })

      blogService.setToken(u.token)

      setUser(u)

      const b = await userService.getUser(u.id)

      setBlogs(b.blogs)

      window.localStorage.setItem('user', JSON.stringify(u))
      console.log('Saving into local storage', u)
      setUsername('')
      setPassword('')
      setNotificationMessage('Logged in')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to application</h2>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        Title
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
        Author
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
        Url
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>

      <button type="submit">save</button>
    </form>
  )

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