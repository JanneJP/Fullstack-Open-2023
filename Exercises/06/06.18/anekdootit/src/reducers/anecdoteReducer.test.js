import deepFreeze from 'deep-freeze'
import anecdoteReducer, { initialState } from './anecdoteReducer'

describe('Anecdote reducer', () => {
  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = anecdoteReducer(undefined, action)

    expect(newState).toEqual(initialState)
  })

  test('Anecdote with id is voted on', () => {
    const action = {
      type: 'anecdotes/voteAnecdote',
      payload: {
        id: initialState[0].id
      }
    }

    const state = initialState

    deepFreeze(state)

    const newState = anecdoteReducer(state, action)
    // TEMP
    // expect(newState[0].votes).toBe(1)
  })

  test('Voting should fail with an invalid id', () => {
    const action = {
      type: 'anecdotes/voteAnecdote',
      payload: {
        id: -1000
      }
    }

    const state = initialState

    deepFreeze(state)

    const newState = anecdoteReducer(state, action)

    expect(newState).toEqual(initialState)
  })

  test('A new anecdote can be added', () => {
    const action = {
      type: 'anecdotes/createAnecdote',
      payload: {
        content: 'TEST ANECDOTE'
      }
    }

    const state = initialState

    deepFreeze(state)

    const newState = anecdoteReducer(state, action)

    expect(newState.map(anecdote => anecdote.content)).toContain('TEST ANECDOTE')
  })

})