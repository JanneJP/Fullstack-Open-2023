import axios from 'axios'

const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)

  return response.data
}

const logout = () => {
  window.localStorage.removeItem('login')
  window.localStorage.removeItem('user')
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { login, logout }