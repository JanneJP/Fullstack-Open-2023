import { useDispatch, useSelector } from 'react-redux'

import { voteAnecdote } from '../reducers/anecdoteReducer'
import { notificationSet, notificationClear } from '../reducers/notificationReducer'

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
    console.log('a')
    dispatch(voteAnecdote(anecdote.id))
    dispatch(notificationSet(`You voted '${anecdote.content}'`))
    setTimeout(() => {
      dispatch(notificationClear())
    }, 5000);
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