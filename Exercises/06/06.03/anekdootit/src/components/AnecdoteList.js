import { useDispatch, useSelector } from 'react-redux'

import { voteAnecdote } from '../reducers/anecdoteReducer'

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
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  return (
    <div>
      {anecdotes.sort((a,b) => b.votes - a.votes).map(anecdote =>
        <Anecdote key={anecdote.id} anecdote={anecdote} voteHandler={() => dispatch(voteAnecdote(anecdote.id))} />
      )}
    </div>
  )
}

export default Anecdotes