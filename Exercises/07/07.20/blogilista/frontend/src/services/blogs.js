import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

export const getBlogs = () =>
  axios.get(baseUrl).then(res => res.data)

const getBlog = async id => {
  const response = await axios.get(`${ baseUrl }/${id}`)

  return response.data
}

export const createBlog = newObject => {
  const config = {
    headers: { Authorization: token },
  }

  axios.post(baseUrl, newObject, config).then(res => res.data)
}

export const updateBlog = newObject => {
  const config = {
    headers: { Authorization: token },
  }

  axios.put(`${ baseUrl }/${newObject.id}`, newObject, config).then(res => res.data)
}

export const removeBlog = newObject => {
  const config = {
    headers: { Authorization: token },
  }

  axios.delete(`${ baseUrl }/${newObject.id}`, config).then(res => res.data)
}

export default { getBlog, updateBlog, removeBlog, setToken }