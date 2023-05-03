import { useDispatch } from 'react-redux'

import { createAnecdote } from '../reducers/anecdoteReducer'
import { notificationSet, notificationClear } from '../reducers/notificationReducer'

const NewAnecdote = () => {
  const dispatch = useDispatch()

    const addAnecdote = async (event) => {
      event.preventDefault()

      const content = event.target.anecdote.value

      dispatch(createAnecdote(content))
      dispatch(notificationSet(`You created '${content}'`))
      setTimeout(() => {
        dispatch(notificationClear())
      }, 5000);

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