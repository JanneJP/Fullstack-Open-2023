import { useState } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = (event) => {
    event.preventDefault()

    handleLogin({
      username: username,
      password: password
    })

    setUsername('')
    setPassword('')
  }

  return (
    <Form onSubmit={login}>
      <h2>Log in to application</h2>
      <Form.Group>
        <Form.Label>Username:</Form.Label>
        <Form.Control
          id='username'
          type='text'
          name='username'
          value={username}
          onChange={event => setUsername(event.target.value)}
        />
        <Form.Label>Password:</Form.Label>
        <Form.Control
          id='password'
          type='password'
          name='password'
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <Button variant='primary' id="login-button" type="submit">
          login
        </Button>
      </Form.Group>
    </Form>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm