import diagnosisData from '../../data/diagnoses.json';

import { DiagnosisData } from '../types';

const diagnoses: DiagnosisData[] = diagnosisData as DiagnosisData[];

const getDiagnoses = (): DiagnosisData[] => {
  return diagnoses;
};

export default {
  getDiagnoses
};