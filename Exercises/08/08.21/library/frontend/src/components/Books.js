import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS, GENRE_BOOKS } from "../queries"

const Books = (props) => {
  const [genre, setGenre] = useState('')
  const booksQuery = useQuery(GENRE_BOOKS, { variables: { genre } })
  console.log(booksQuery)
  if (!props.show) {
    return null
  }

  if (booksQuery.loading) {
    return <div>loading...</div>
  }

  const books = booksQuery.data.allBooks

  const genres = []

  books.forEach(book => {
    book.genres.forEach(genre => {
      if (!genres.includes(genre)) {
        genres.push(genre)
      }
    })
  })

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((g) => (
        <button onClick={() => setGenre(g)}>{g}</button>
      ))}
      <button onClick={() => setGenre('')}>Clear</button>
    </div>
  )
}

export default Books
