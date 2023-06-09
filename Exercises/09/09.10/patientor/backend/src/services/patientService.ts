import { v4 as uuidv4 } from 'uuid';

import patientData from '../../data/patients.json';
import { PatientData, NonSensitivePatientData, NewPatientData } from '../types';

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

const addPatient = (patient: NewPatientData): PatientData => {

  const newPatientData = {
    id: uuidv4(),
    ...patient
  };

  patients.push(newPatientData);

  return newPatientData;
};

export default {
  getPatients,
  getPatientsNoSsn,
  addPatient
};