interface Exercise {
  days: number[],
  target: number
}

const parseArguments2 = (args: string[]): Exercise => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const target = args[2]
  const days = args.slice(3, args.length)

  if (isNaN(Number(target))) {
    throw new Error(`Target ${target} was not a number`);
  }

  for(const day in days) {
    if (isNaN(Number(day))) {
      throw new Error('Provided values were not numbers!');
    }
  }

  return {
    days: days.map(d => Number(d)),
    target: Number(target)
  }
}

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

try {
  const { days, target } = parseArguments2(process.argv);
  console.log(calculateExercises(days, target))
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

