import { useDispatch, useSelector } from 'react-redux'

import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, voteHandler }) => {
  return (
    <div>
    <div>
      {anecdote.content}
    </div>
    <div>
      has {anecdote.votes}
      <button onClick={voteHandler}>vote</button>
    </div>
  </div>
  )
}

const Anecdotes = () => {
  const anecdotes = useSelector(state => {
    if (state.filter !== '') {
      return state.anecdotes.filter(anecdote => anecdote.content.includes(state.filter))
    } else {
      return state.anecdotes
    }
  })
  const dispatch = useDispatch()
  const sortedAnecdotes = anecdotes.map(anecdote => anecdote).sort((a,b) => b.votes - a.votes)

  const voteHandler = (anecdote) => {
    dispatch(voteAnecdote(anecdote.id))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <div>
      {sortedAnecdotes.map(anecdote =>
        <Anecdote key={anecdote.id} anecdote={anecdote} voteHandler={() => {voteHandler(anecdote)}} />
      )}
    </div>
  )
}

export default Anecdotes