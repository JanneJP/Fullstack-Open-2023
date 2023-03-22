const App = () => {
    const course = 'Half Stack application development'

    const parts = [
        {
            name: 'Fundamentals of React',
            exercises: 10
        }, {
            name: 'Using props to pass data',
            exercises: 7
        }, {
            name: 'State of a component',
            exercises: 14
        }
    ]

    return (
        <div>
            <Header header_text={course} />
            <Content contents={parts} />
            <Total contents={parts} />
        </div>
    )
}

const Header = (props) => {
    return (
        <div>
            <h1>{props.header_text}</h1>
        </div>
    )
}

const Content = (props) => {
    return (
        <div>
            <Part name={props.contents[0].name} exercises={props.contents[0].exercises} />
            <Part name={props.contents[1].name} exercises={props.contents[1].exercises} />
            <Part name={props.contents[2].name} exercises={props.contents[2].exercises} />
        </div>
    )
}

const Part = (props) => {
    return (
        <div>
            <p>{props.name} {props.exercises}</p>
        </div>
    )
}

const Total = (props) => {
    let total = 0;

    props.contents.map(function(content, index) {
        total = total + content.exercises;
    })

    return (
        <div>
            <p>Number of exercises {total}</p>
        </div>
    )
}

export default App