import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import axios from 'axios';

import { Patient } from "../../types";

import patientService from "../../services/patients";

import { apiBaseUrl } from "../../constants";

const PatientPage = () => {
  const id = useParams().id
  const [patient, setPatient] = useState<Patient>();

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatient = async () => {
      if(id) {
        const patient = await patientService.getById(id)
        setPatient(patient);
      }
    };
    void fetchPatient();
  }, [id]);

  if(!patient) {
    return null
  }

  return (
    <div>
      <h2>{patient.name} ({patient.gender})</h2>
      <p>{patient.ssn}</p>
      <p>{patient.occupation}</p>
    </div>
  );
};

export default PatientPage;
