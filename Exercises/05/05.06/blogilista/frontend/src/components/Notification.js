// eslint-disable-next-line react/prop-types
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

export default Notification