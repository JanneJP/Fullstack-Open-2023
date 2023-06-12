import { v4 as uuidv4 } from 'uuid';

import patients from '../../data/patients';
import { Patient, NonSensitivePatient, NewPatient } from '../types';

const findById = (id: string): Patient | undefined => {
  const patient = patients.find(d => d.id === id);

  return patient;
};

const getPatients = (): Patient[] => {
  return patients;
};

const getPatientsNoSsn = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name, dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = (patient: NewPatient): Patient => {

  const newPatient = {
    id: uuidv4(),
    ...patient
  };

  patients.push(newPatient);

  return newPatient;
};

const updatePatient = (patient: Patient): Patient => {
  patients.map(p => p.id !== patient.id ? p : patient);

  return patient;
};

export default {
  getPatients,
  getPatientsNoSsn,
  addPatient,
  findById,
  updatePatient
};