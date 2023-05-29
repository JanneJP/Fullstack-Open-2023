interface Results {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

interface Rating {
  rating: number,
  ratingDescription: string
}

const rate = (dailyHours: number[], target: number): Rating => {
  const total = sum(dailyHours)
  const average = total / dailyHours.length
  if(average > target) {
    return { rating: 3, ratingDescription: 'Target reached' }
  } else if (target / average > 0.5) {
    return { rating: 2, ratingDescription: 'not too bad but could be better' }
  } else {
    return { rating: 1, ratingDescription: 'Do better' }
  }
}

const sum = (numArray: number[]): number => {
  return numArray.reduce((accumulator, currentValue) => {
    return accumulator + currentValue
  }, 0);
}

const calculateExercises = (dailyHours: number[], target: number): Results => {
  const total = sum(dailyHours)
  const average = total / dailyHours.length;
  const { rating, ratingDescription } = rate(dailyHours, target)

  return {
    periodLength: dailyHours.length,
    trainingDays: dailyHours.filter(d => d != 0).length,
    target: target,
    average: average,
    success: average >= target,
    rating: rating,
    ratingDescription: ratingDescription
  }
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))