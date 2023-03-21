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
    const positive = good / total * 100

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
                <table>
                    <tbody>
                        <StatisticLine text="Good" value={statistics.good} />
                        <StatisticLine text="Neutral" value={statistics.neutral} />
                        <StatisticLine text="Bad" value={statistics.bad} />
                        <StatisticLine text="Total" value={statistics.total} />
                        <StatisticLine text="Average" value={statistics.average} round={true} />
                        <StatisticLine text="Positive" value={statistics.positive} round={true} percentage={true} />
                    </tbody>
                </table>
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
    let value = props.value
    if (props.round === true) {
        value = props.value.toFixed(1)
    }

    if (props.percentage === true) {
        value = value + "%"
    }
    return (
        <tr>
            <td>{props.text}</td>
            <td>{value}</td>
        </tr>
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