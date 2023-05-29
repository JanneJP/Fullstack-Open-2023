import patientData from '../../data/patients.json';

import { PatientData, NonSensitivePatientData } from '../types';

const patients: PatientData[] = patientData as PatientData[];

const getPatients = (): PatientData[] => {
  return patients;
};

const getPatientsNoSsn = (): NonSensitivePatientData[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name, dateOfBirth,
    gender,
    occupation
  }));
};

export default {
  getPatients,
  getPatientsNoSsn
};