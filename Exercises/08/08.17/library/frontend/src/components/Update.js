import AuthorBirth from "./AuthorBirth"

const Update = (props) => {

  if (!props.show) {
    return null
  }


  return (
    <div>
      <h2>books</h2>

      <AuthorBirth />
    </div>
  )
}

export default Update
