import { useEffect, useRef, useReducer } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import { getBlogs, createBlog, updateBlog, removeBlog } from './services/blogs'
import loginService from './services/login'
//import userService from './services/users'

import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'

const App = () => {
  const queryClient = useQueryClient()
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')
  const [user, userDispatch] = useReducer(userReducer, null)

  const blogs = useQuery('blogs', getBlogs)

  const newBlogMutation = useMutation(createBlog, {
    onSuccess: () => {
      console.log('Refreshing blogs')
      queryClient.invalidateQueries('blogs')
    }
  })

  const updateBlogMutation = useMutation(updateBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  const removeBlogMutation = useMutation(removeBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  useEffect(() => {
    const userJSON = window.localStorage.getItem('user')

    if (userJSON) {
      const u = JSON.parse(userJSON)
      userDispatch({ type: 'LOGIN', payload: u })
      console.log('Found in local storage', u)
      blogService.setToken(u.token)
    }
  }, [])

  const flash = (notification, type=null) => {
    console.log(notification)
    const payload = {
      message: notification,
      type: type
    }
    notificationDispatch({ type: 'SET', payload: payload })
    setTimeout(() => { notificationDispatch({ type: 'CLEAR' }) }, 5000)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('login')
    window.localStorage.removeItem('user')
    userDispatch({ type: 'LOGOUT' })
    flash('Logged out')
  }

  const handleLike = (blogObject) => {
    updateBlogMutation.mutate({ ...blogObject, likes: blogObject.likes + 1 })
  }

  const handleRemove = async (blogObject) => {
    if (blogObject.user.id !== user.id) {
      flash('Not the owner')
      return
    }

    if (confirm('Are you sure you want to remove the blog?') === true) {
      removeBlogMutation.mutate({ ...blogObject })
      flash('Deleted successfully')
    }
  }

  const handleLogin = async (loginObject) => {
    try {
      const u = await loginService.login(loginObject)

      blogService.setToken(u.token)

      userDispatch({ type: 'LOGIN', payload: u })

      window.localStorage.setItem('user', JSON.stringify(u))
      console.log('Saving into local storage', u)

      flash('Logged in')
    } catch (exception) {
      flash('Wrong credentials', 'ERROR')
    }
  }

  const blogFormRef = useRef()

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()

      newBlogMutation.mutate(blogObject)

      flash('New blog added')
    } catch (exception) {
      flash('Something went wrong')
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
        <BlogForm createBlog={addBlog} />
      </Togglable>
    )
  }

  const showBlogs = () => {
    if ( blogs.isLoading ) {
      return <div>loading data...</div>
    }

    if ( blogs.isError) {
      return <div>Error loading data...</div>
    }

    const b = blogs.data.sort((a,b) => b.likes - a.likes)

    return (
      <div>
        {b.map(blog => <Blog key={blog.id} blog={blog} user={user} buttonLabel='Show' likeBlog={handleLike} removeBlog={handleRemove} />)}
      </div>
    )
  }

  return (
    <div>
      <Notification notification={notification} />
      {!user && loginForm()}
      {user && <div>
        <h2>blogs</h2>
        <p>{user.name} logged in <button id="logout-button" type="button" onClick={handleLogout}>Logout</button></p>
        {blogForm()}
        {showBlogs()}
      </div>
      }
    </div>
  )
}

export default App