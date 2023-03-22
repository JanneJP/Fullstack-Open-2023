const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}
  
const Header = ({ course }) => {
  return (
    <div>
      <h2>{course.name}</h2>
    </div>
  )
}

const Content = ({ course }) => {
    return (
      <div>
        {course.parts.map(part => <Part key={part.id} part={part} />)}
      </div>
    )
}

const Part = ({ part }) => {
  return (
    <div>
      <p>{part.name} {part.exercises}</p>
    </div>
  )
}

const Total = ({ course }) => {
  const total = course.parts.reduce(
    (accumulator, part) => accumulator + part.exercises, 0
  );

  return (
    <div>
      <b>Number of exercises {total}</b>
    </div>
  )
}
  
export default Course