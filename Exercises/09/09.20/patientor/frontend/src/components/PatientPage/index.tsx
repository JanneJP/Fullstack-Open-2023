import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import axios from 'axios';

import { Entry, Patient } from "../../types";

import patientService from "../../services/patients";

import { apiBaseUrl } from "../../constants";

type PatientEntryProps = {
  entry: Entry
}

const PatientEntry = (props: PatientEntryProps) => {
  switch (props.entry.type) {
    case "HealthCheck":
      return (
        <div>
          <p>{props.entry.date} {props.entry.description}</p>
          {props.entry.diagnosisCodes?.map(code => <li>{code}</li>)}
        </div>
      )
    case "Hospital":
      return (
        <div>
          <p>{props.entry.date} {props.entry.description}</p>
          {props.entry.diagnosisCodes?.map(code => <li>{code}</li>)}
        </div>
      )
    case "OccupationalHealthcare":
      return (
        <div>
          <p>{props.entry.date} {props.entry.description}</p>
          {props.entry.diagnosisCodes?.map(code => <li>{code}</li>)}
        </div>
      )
    default:
      throw new Error('Unhandled entry type')
  }
}

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
      <h2>Entries</h2>
      {patient.entries.map(entry => <PatientEntry entry={entry} />)}
    </div>
  );
};

export default PatientPage;
