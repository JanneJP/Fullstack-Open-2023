import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const update = async (content) => {
  const anecdoteUrl = `${baseUrl}/${content}`
  const anecdote = await axios.get(anecdoteUrl)
  const data = anecdote.data
  const updatedAnecdote = { ...data, votes: data.votes + 1}
  const response = await axios.put(anecdoteUrl, updatedAnecdote)
  return response.data
}

export default { 
  getAll,
  createNew,
  update
}