import express from 'express';

import patientService from '../services/patientService';
import toNewPatientData from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  console.log('Fetching all patients!');

  res.send(patientService.getPatientsNoSsn());
});

router.post('/', (req, res) => {
  console.log('Adding new patient');

  try {
    const newPatientData = toNewPatientData(req.body);

    const addedPatient = patientService.addPatient(newPatientData);

    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;