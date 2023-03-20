import { useState } from 'react'

const App = () => {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const increaseGoodByOne = () => {
        setGood(good + 1)
    }

    const increaseNeutralByOne = () => {
        setNeutral(neutral + 1)
    }

    const increaseBadByOne = () => {
        setBad(bad + 1)
    }

    const total = good + neutral + bad;
    const average = (good - bad) / total
    const positive = good / (total * 100)

    return (
        <div>
            <h1>Give Feedback</h1>
            <Button handleClick={increaseGoodByOne} text="Good" />
            <Button handleClick={increaseNeutralByOne} text="Neutral" />
            <Button handleClick={increaseBadByOne} text="Bad" />
            <h1>Statistics</h1>
            <Display name="Good" counter={good} />
            <Display name="Neutral" counter={neutral} />
            <Display name="Bad" counter={bad} />
            <Display name="Total" counter={total} />
            <Display name="Average" counter={average} />
            <Display name="Positive" counter={positive} ending=" %"/>
        </div>
    )
}

const Display = (props) => {
    return (
        <div>
            <p>{props.name}: {props.counter}{props.ending}</p>
        </div>
    )
}

const Button = (props) => {
    return (
        <button onClick={props.handleClick}>
            {props.text}
        </button>
    )
}

export default App