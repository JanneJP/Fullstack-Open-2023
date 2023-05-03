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
      type: 'filter/filterChange',
      payload: {
        filter: 'TEST FILTER STRING'
      }
    }

    const state = initialState

    deepFreeze(state)

    const newState = filterReducer(state, action)

    expect(newState).toStrictEqual({filter: 'TEST FILTER STRING'})
  })
})