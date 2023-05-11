import axios from 'axios'

const baseUrl = '/api/users'

export const getAllUsers = () => {
  const data = axios.get(baseUrl).then(res => res.data)
  console.log(data)
  return data
}

const getUser = async (id) => {
  const response = await axios.get(`${ baseUrl }/${id}`)

  return response.data
}

export default { getUser, getAllUsers }