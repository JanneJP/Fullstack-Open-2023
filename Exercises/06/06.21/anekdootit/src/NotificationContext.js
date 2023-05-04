import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET":
        return action.payload.message
    case "CLEAR":
        return state = ''
    default:
        return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={{notification, notificationDispatch}}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const { notification } = useContext(NotificationContext)

  return notification
}

export const useNotificationDispatch = () => {
  const { notificationDispatch } = useContext(NotificationContext)

  return notificationDispatch
}

export default NotificationContext