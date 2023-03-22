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

    const statistics = {
        good: good,
        neutral: neutral,
        bad: bad,
        total: total,
        average: average,
        positive:positive
    }

    return (
        <div>
            <h1>Give Feedback</h1>
            <Button handleClick={increaseGoodByOne} text="Good" />
            <Button handleClick={increaseNeutralByOne} text="Neutral" />
            <Button handleClick={increaseBadByOne} text="Bad" />
            <Statistics statistics={statistics} />
        </div>
    )
}

const Statistics = (props) => {
    const { statistics } = props
    if (statistics.total > 0) {
        return (
            <div>
                <h1>Statistics</h1>
                <StatisticLine text="Good" value={statistics.good} />
                <StatisticLine text="Neutral" value={statistics.neutral} />
                <StatisticLine text="Bad" value={statistics.bad} />
                <StatisticLine text="Total" value={statistics.total} />
                <StatisticLine text="Average" value={statistics.average} />
                <StatisticLine text="Positive" value={statistics.positive}/>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Statistics</h1>
                <p>No feedback given yet</p>
            </div>
        )
    }
}

const StatisticLine = (props) => {
    const { text, value } = props
    return (
        <div>
            <p>{text}: {value}</p>
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