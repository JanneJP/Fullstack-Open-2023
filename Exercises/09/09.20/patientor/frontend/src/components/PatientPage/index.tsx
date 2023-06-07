import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import axios from 'axios';

import { Patient, Entry, Diagnosis } from "../../types";

import patientService from "../../services/patients";

import { apiBaseUrl } from "../../constants";

import diagnosisService from "../../services/diagnoses";

type PatientEntryProps = {
  entry: Entry
}

type PatientEntriesProps = {
  entries: Entry[]
}

type PatientDiagnosisProps = {
  code: string
}

const PatientDiagnosis = (props: PatientDiagnosisProps) => {
  const [diagnosis, setDiagnosis] = useState<Diagnosis>();

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchDiagnosis = async () => {
      const diagnosis = await diagnosisService.getByCode(props.code)
      setDiagnosis(diagnosis);
    };
    void fetchDiagnosis();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(!diagnosis) {
    return null
  }
  return (
    <li key={diagnosis.id}>{diagnosis.code} {diagnosis.name}</li>
  )
}

const PatientEntries = (props: PatientEntriesProps) => {
  return (
    <div>
      <h2>Entries</h2>
      {props.entries.map(entry => <PatientEntry entry={entry} />)}
    </div>
  )
}

const assertNever = (entry: never): never => {
    throw new Error('Unhandled entry')  
}

const PatientEntry = (props: PatientEntryProps) => {
  const boxStyle = {
    border: '1px solid rgba(0, 0, 0, 1)', 
  }

  switch(props.entry.type) {
    case "HealthCheck":
      return (
        <div key={props.entry.id} style={boxStyle}>
          <p>{props.entry.date} {props.entry.description}</p>
          <p>Health {props.entry.healthCheckRating} / 3 (0 Healthy - 3 Critical)</p>
          {props.entry.diagnosisCodes?.map(code => <PatientDiagnosis code={code} />)}
          <p>Diagnosed by {props.entry.specialist}</p>
        </div>
      )
    case "Hospital":
      return (
        <div key={props.entry.id} style={boxStyle}>
          <p>{props.entry.date} {props.entry.description}</p>
          <p>{props.entry.discharge.criteria} {props.entry.discharge.date}</p>
          {props.entry.diagnosisCodes?.map(code => <PatientDiagnosis code={code} />)}
          <p>Diagnosed by {props.entry.specialist}</p>
        </div>
      )
    case "OccupationalHealthcare":
      return (
        <div key={props.entry.id} style={boxStyle}>
          <p>{props.entry.date} {props.entry.description} - Employer: {props.entry.employerName}</p>
          {props.entry.sickLeave ? <p>Sickleave from {props.entry.sickLeave.startDate} until {props.entry.sickLeave.endDate}</p> : null}
          {props.entry.diagnosisCodes?.map(code => <PatientDiagnosis code={code} />)}
        </div>
      )
    default:
      return assertNever(props.entry)
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(!patient) {
    return null
  }

  return (
    <div>
      <h2>{patient.name} ({patient.gender})</h2>
      <p>{patient.ssn}</p>
      <p>{patient.occupation}</p>
      <PatientEntries entries={patient.entries} />
    </div>
  );
};

export default PatientPage;
