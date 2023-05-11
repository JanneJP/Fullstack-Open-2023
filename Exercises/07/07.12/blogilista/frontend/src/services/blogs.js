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

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(`${ baseUrl }/${id}`, newObject, config)

  return response.data
}

const remove = async id => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${ baseUrl }/${id}`, config)

  return response.data
}

export default { getBlog, update, remove, setToken }