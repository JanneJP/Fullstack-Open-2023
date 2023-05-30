import { v4 as uuidv4 } from 'uuid';

import patients from '../../data/patients';
import { PatientData, NonSensitivePatientData, NewPatientData } from '../types';

const findById = (id: string): PatientData | undefined => {
  const patient = patients.find(d => d.id === id);

  return patient;
};

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
  addPatient,
  findById
};