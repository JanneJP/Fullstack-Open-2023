import express from 'express';

import patientService from '../services/patientService';
import { toNewPatient, toNewEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  console.log('Fetching all patients!');

  res.send(patientService.getPatientsNoSsn());
});

router.get('/:id', (req, res) => {
  console.log('Fetching patient!');
  const patient = patientService.findById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req, res) => {
  console.log('Adding new patient');

  try {
    const newPatient = toNewPatient(req.body);

    const addedPatient = patientService.addPatient(newPatient);

    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post('/:id/entries', (req, res) => {
  console.log('Adding new entry for patient!');
  const patient = patientService.findById(req.params.id);

  if (patient) {
    try {
      const newEntry = toNewEntry(req.body);
  
      patient.entries.push(newEntry);
  
      const updatedPatient = patientService.updatePatient(patient);
  
      res.json(updatedPatient);
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong.';
  
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      res.status(400).send(errorMessage);
    }
  } else {
    res.sendStatus(404);
  }
});

export default router;