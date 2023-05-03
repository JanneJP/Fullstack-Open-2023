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

export const setNotification = ( content, timer ) => {
  return dispatch => {
    dispatch(notificationSet(content))
    setTimeout(() => {
      dispatch(notificationClear())
    }, timer*1000);
  }
}

export default filterSlice.reducer