const App = () => {
    const course = 'Half Stack application development'
    const part1 = 'Fundamentals of React'
    const exercises1 = 10
    const part2 = 'Using props to pass data'
    const exercises2 = 7
    const part3 = 'State of a component'
    const exercises3 = 14

    const contents = [
        {name: part1, exercises: exercises1},
        {name: part2, exercises: exercises2},
        {name: part3, exercises: exercises3}
    ]

    return (
        <div>
            <Header header_text={course} />
            <Content contents={contents} />
            <Total contents={contents} />
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
            {props.contents.map(function(content, index) {
                return <p>{content.name} {content.exercises}</p>;
            })}
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