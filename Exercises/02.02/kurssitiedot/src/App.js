const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      }, {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      }, {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

const Header = (props) => {
  return (
    <div>
      <h1>{props.course.name}</h1>
    </div>
  )
}

const Content = (props) => {
  const { parts } = props.course
  
    return (
      <div>
        {parts.map(part => <Part key={part.id} part={part} />)}
      </div>
    )
}

const Part = (props) => {
    return (
        <div>
            <p>{props.part.name} {props.part.exercises}</p>
        </div>
    )
}

const Total = (props) => {
    let total = 0;

    props.course.parts.map(function(part, index) {
        total = total + part.exercises;
    })

    return (
        <div>
            <p>Number of exercises {total}</p>
        </div>
    )
}

export default App