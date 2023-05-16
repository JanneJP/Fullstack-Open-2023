import axios from 'axios'

const baseUrl = '/api/comments'

export const createComment = newObject => {
  axios.post(baseUrl, newObject).then(res => res.data)
}


export default { createComment }