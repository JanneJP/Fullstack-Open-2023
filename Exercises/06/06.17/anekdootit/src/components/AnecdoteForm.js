import { useDispatch } from 'react-redux'

import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const NewAnecdote = () => {
  const dispatch = useDispatch()

    const addAnecdote = async (event) => {
      event.preventDefault()

      const content = event.target.anecdote.value

      dispatch(createAnecdote(content))
      dispatch(setNotification(`You created '${content}'`, 5))

      event.target.anecdote.value = ''
  }

  return (
    <form onSubmit={addAnecdote}>
      <h2>create new</h2>
      <input name="anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

export default NewAnecdote