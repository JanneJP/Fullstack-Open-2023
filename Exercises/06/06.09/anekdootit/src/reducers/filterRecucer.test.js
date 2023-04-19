import deepFreeze from 'deep-freeze'

import filterReducer from './filterReducer'

const initialState = ''

describe('Filter reducer', () => {
  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = filterReducer(undefined, action)

    expect(newState).toEqual(initialState)
  })

  test('Correct filter string', () => {
    const action = {
      type: 'SET_FILTER',
      payload: {
        filter: 'TEST FILTER STRING'
      }
    }

    const state = initialState

    deepFreeze(state)

    const newState = filterReducer(state, action)

    expect(newState).toBe('TEST FILTER STRING')
  })
})