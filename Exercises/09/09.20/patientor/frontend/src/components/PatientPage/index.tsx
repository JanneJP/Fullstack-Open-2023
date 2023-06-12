import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { Box, Table, Button, TableHead, Typography, TableCell, TableRow, TableBody } from '@mui/material';

import { Patient, Entry, Diagnosis } from "../../types";

import patientService from "../../services/patients";

import { apiBaseUrl } from "../../constants";

import diagnosisService from "../../services/diagnoses";

import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../../types";

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

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const openModal = (): void => setModalOpen(true);
  const [error, setError] = useState<string>();

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

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

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      if (!patient) {
        return null
      }
      const updatedPatient = await patientService.createEntry(patient.id, values);
      setPatient(updatedPatient);
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  if(!patient) {
    return null
  }

  return (
    <div>
      <h2>{patient.name} ({patient.gender})</h2>
      <p>{patient.ssn}</p>
      <p>{patient.occupation}</p>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
      <PatientEntries entries={patient.entries} />
    </div>
  );
};

export default PatientPage;
