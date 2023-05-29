import { useQuery } from '@apollo/client'

import { GENRE_BOOKS } from "../queries"

const Recommended = (props) => {
  const genre = localStorage.getItem('favoriteGenre') ? localStorage.getItem('favoriteGenre') : ''

  const booksQuery = useQuery(GENRE_BOOKS, { variables: { genre } })

  if (!props.show) {
    return null
  }

  if (booksQuery.loading) {
    return <div>loading...</div>
  }

  const books = booksQuery.data.allBooks

  return (
    <div>
      <h2>books based on your favorite genre {genre}</h2>

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
    </div>
  )
}

export default Recommended
