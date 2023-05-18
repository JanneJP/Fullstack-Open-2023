import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import Select from 'react-select'

import { EDIT_BORN, ALL_AUTHORS } from '../queries'

const AuthorBirth = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const authors = useQuery(ALL_AUTHORS)

  const [ editBorn ] = useMutation(EDIT_BORN, {
    refetchQueries: [ { query: ALL_AUTHORS} ]
  })

  if (authors.loading) {
    return <div>loading...</div>
  }

  const submit = async (event) => {
    event.preventDefault()

    editBorn({ variables: { name, born } })

    setName('')
    setBorn('')
  }

  const onOptionChange = (event) => {
    setName(event.value)
  }

  const options = authors.data.allAuthors.map(a => ({value: a.name, label: a.name}))

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <Select options={options} onChange={onOptionChange} />
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(parseInt(target.value))}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default AuthorBirth