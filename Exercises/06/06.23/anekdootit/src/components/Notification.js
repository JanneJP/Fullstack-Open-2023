import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  if (notification) {
    return (
      <div style={style}>
        {notification}
      </div>
    )
  } else {
    return (
      <div>
      
      </div>
    )
  }
}

export default Notification
