import { useState } from 'react'

const CommentForm = ({ handleComment, blog }) => {
  const [comment, setComment] = useState('')

  const createComment = (event) => {
    event.preventDefault()

    handleComment({
      message: comment,
      blog: blog
    })

    setComment('')
  }

  return (
    <form onSubmit={createComment}>
      <div>
        <input
          id='comment'
          type="text"
          value={comment}
          name="comment"
          onChange={event => setComment(event.target.value)}
        />
        <button id="comment-button" type="submit">Add Comment</button>
      </div>
    </form>
  )
}

export default CommentForm