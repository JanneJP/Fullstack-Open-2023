import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div>
      <p>{message}</p>
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.any
}

export default Notification