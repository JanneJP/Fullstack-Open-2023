import express from 'express';

import diagnosisService from '../services/diagnosisService';

import { toNewDiagnosis } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  console.log('Fetching all diagnoses!');
  res.send(diagnosisService.getDiagnoses());
});

router.get('/:code', (req, res) => {
  console.log('Fetching diagnosis!');
  const diagnosis = diagnosisService.findByCode(req.params.code);

  if (diagnosis) {
    res.send(diagnosis);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req, res) => {
  console.log('Adding new diagnosis');

  try {
    const newDiagnosis = toNewDiagnosis(req.body);

    const addedDiagnosis = diagnosisService.addDiagnosis(newDiagnosis);

    res.json(addedDiagnosis);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;