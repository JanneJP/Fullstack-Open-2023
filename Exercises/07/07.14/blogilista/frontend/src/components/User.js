export const User = (props) => {
  return (
    <tr>
      <td>{props.user.name}</td>
      <td style={{ textAlign: 'right' }}>{props.user.blogs.length}</td>
    </tr>
  )
}