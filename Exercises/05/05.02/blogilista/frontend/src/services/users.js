import axios from 'axios'

const baseUrl = '/api/users'

const getAll = async () => {
  const response = await axios.get(baseUrl)

  return response.data
}

const getUser = async (id) => {
  const response = await axios.get(`${ baseUrl }/${id}`)

  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getUser, getAll }