import { v4 as uuidv4 } from 'uuid';

import diagnoses from '../../data/diagnoses';
import { Diagnosis, NewDiagnosis } from '../types';

const findByCode = (code: string): Diagnosis | undefined => {
  const diagnosis = diagnoses.find(d => d.code === code);

  return diagnosis;
};

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

const addDiagnosis = (diagnosis: NewDiagnosis): Diagnosis => {

  const newDiagnosis = {
    id: uuidv4(),
    ...diagnosis
  };

  diagnoses.push(newDiagnosis);

  return newDiagnosis;
};

export default {
  getDiagnoses,
  findByCode,
  addDiagnosis
};
