import PropTypes from 'prop-types'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  switch(notification.type) {
  case 'ERROR':
    console.log(notification.message)
    return (
      <div>
        <p style={{ color: 'red' }}>{notification.message}</p>
      </div>
    )
  default:
    return (
      <div>
        <p>{notification.message}</p>
      </div>
    )
  }
}

Notification.propTypes = {
  notification: PropTypes.any
}

export default Notification