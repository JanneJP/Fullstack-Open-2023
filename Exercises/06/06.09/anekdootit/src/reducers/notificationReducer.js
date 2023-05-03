import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const filterSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notificationSet(state, action) {
      return action.payload
    },
    notificationClear(state, action) {
      return ''
    }
  }
})

export const { notificationSet, notificationClear } = filterSlice.actions
export default filterSlice.reducer