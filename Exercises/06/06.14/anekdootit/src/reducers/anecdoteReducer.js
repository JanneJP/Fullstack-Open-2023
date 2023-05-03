import { createSlice } from '@reduxjs/toolkit'

import anecdoteService from "../services/anecdotes"

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    updateAnecdote(state, action) {
      return state.map(anecdote => anecdote.id !== action.payload.id ? anecdote : action.payload)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { appendAnecdote, setAnecdotes, updateAnecdote } = anecdoteSlice.actions

export const voteAnecdote = content => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.update(content)
    dispatch(updateAnecdote(updatedAnecdote))
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export default anecdoteSlice.reducer