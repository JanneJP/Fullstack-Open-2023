import { filterChange } from '../reducers/filterReducer'
import { useDispatch } from 'react-redux'

const Filter = () => {
  const dispatch = useDispatch()

  const setFilter = (event) => {
    event.preventDefault()

    const filter = event.target.value

    dispatch(filterChange(filter))
  }

  return (
    <div>
      Filter    
      <input 
        type="text" 
        name="filter" 
        onChange={setFilter}
      />
    </div>
  )
}

export default Filter
