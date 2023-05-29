import express from 'express';

import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const weight = Number(req.query.weight);
  const height = Number(req.query.height);

  if (isNaN(weight) || isNaN(height)) {
    res.status(400).send({error: "malformatted parameters"});
  }

  const bmi = calculateBmi(height, weight);

  const data = {
    height: height,
    weight: weight,
    bmi: bmi
  };
  res.json(data);
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { target, daily_exercises } = req.body;

  if (!target || ! daily_exercises) {
    res.status(400).send({error: "Missing parameter"});
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (isNaN(target)) {
    res.status(400).send({error: "Malformed parameter target"});
  }

  for (const day of daily_exercises) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (isNaN(day)) {
      res.status(400).send({error: "Malformed parameter daily_exercises"});
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const data = calculateExercises(daily_exercises, target);

  res.json(data);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
