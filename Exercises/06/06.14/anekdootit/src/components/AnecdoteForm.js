import { useDispatch } from 'react-redux'

import { createAnecdote } from '../reducers/anecdoteReducer'
import { notificationSet, notificationClear } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const NewAnecdote = () => {
  const dispatch = useDispatch()

    const addAnecdote = async (event) => {
      event.preventDefault()

      const content = event.target.anecdote.value
      const newAnecdote = await anecdoteService.createNew(content)

      dispatch(createAnecdote(newAnecdote))
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