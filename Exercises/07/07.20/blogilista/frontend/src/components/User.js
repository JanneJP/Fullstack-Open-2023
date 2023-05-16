import { Link } from 'react-router-dom'

export const User = (props) => {
  return (
    <tr>
      <td><Link to={`/users/${props.user.id}`}>{props.user.name}</Link></td>
      <td>{props.user.blogs.length}</td>
    </tr>
  )
}