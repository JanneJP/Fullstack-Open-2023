import { useState, SyntheticEvent } from "react";
import {  TextField, InputLabel, MenuItem, Select, Grid, Button, SelectChangeEvent } from '@mui/material';

import { HealthCheckRating, EntryTypes } from "../../types";

import { EntryFormValues, } from "../../types";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
}

interface TypeOption {
  value: EntryTypes;
  label: string;
}

const typeOptions: TypeOption[] = Object.values(EntryTypes).map(v => ({
  value: v, label: v.toString()
}));

interface HealthCheckRatingOption {
  value: HealthCheckRating;
  label: string;
}

const healthCheckRatingOptions: HealthCheckRatingOption[] = Object.values(HealthCheckRating).map(v => ({
  value: v as HealthCheckRating, label: v.toString()
}));

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const [type, setType] = useState<EntryTypes>(EntryTypes.Hospital);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [employer, setEmployer] = useState('');

  const [diagnosisCode, setDiagnosisCode] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  const [sickLeaveStartDate, setSickLeaveStartDate] = useState('');
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState('');

  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);

  const onEntryTypeChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if ( typeof event.target.value === "string") {
      const value = event.target.value;
      const entryType = Object.values(EntryTypes).find(e => e.toString() === value);
      if (entryType) {
        setType(entryType);
      }
    }
  };

  const onHealthCheckRatingChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if ( typeof event.target.value === "string") {
      const value = event.target.value;

      const healthCheckRating = Object.values(HealthCheckRating).find(h => h === value);

      if (healthCheckRating) {
        setHealthCheckRating(healthCheckRating as HealthCheckRating);
      }
    }
  };

  const onDiagnosisCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const value = event.target.value;

    if (value && value[-1] === ',') {
      setDiagnosisCodes(diagnosisCodes.concat(value))      
      setDiagnosisCode('')
    }

    setDiagnosisCode(value)
  }

  const addEntry = (event: SyntheticEvent) => {
    const sickLeave = {
      startDate: sickLeaveStartDate,
      endDate: sickLeaveEndDate
    }

    const discharge = {
      date: dischargeDate,
      criteria: dischargeCriteria
    }
    console.log(discharge.date, typeof(discharge.date))
    event.preventDefault();
    onSubmit({
      type, 
      description,
      date,
      specialist,
      sickLeave: sickLeave,
      discharge: discharge,
      healthCheckRating: healthCheckRating,
      employerName: employer
    });
  };

  switch(type) {
    case "Hospital":
      return (
        <div>
          <InputLabel style={{ marginTop: 20 }}>Entry Type</InputLabel>
          <Select
            label="Entry"
            fullWidth
            value={type}
            onChange={onEntryTypeChange}
          >
          {typeOptions.map(option =>
            <MenuItem
              key={option.label}
              value={option.value}
            >
              {option.label
            }</MenuItem>
          )}
          </Select>
          <form onSubmit={addEntry}>
              <TextField
                label="Description"
                fullWidth 
                value={description}
                onChange={({ target }) => setDescription(target.value)}
              />
              <TextField
                label="Date"
                fullWidth 
                value={date}
                onChange={({ target }) => setDate(target.value)}
              />
              <TextField
                label="Specialist"
                fullWidth 
                value={specialist}
                onChange={({ target }) => setSpecialist(target.value)}
              />
              <TextField
                label="Discharge Date"
                fullWidth 
                value={dischargeDate}
                onChange={({ target }) => setDischargeDate(target.value)}
              />
              <TextField
                label="Discharge Criteria"
                fullWidth 
                value={dischargeCriteria}
                onChange={({ target }) => setDischargeCriteria(target.value)}
              />
              <TextField
                label="Diagnosis Codes"
                fullWidth 
                value={diagnosisCode}
                onChange={onDiagnosisCodeChange}
              />
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      )
  case "HealthCheck":
    return (
      <div>
        <InputLabel style={{ marginTop: 20 }}>Entry Type</InputLabel>
        <Select
          label="Entry"
          fullWidth
          value={type}
          onChange={onEntryTypeChange}
        >
        {typeOptions.map(option =>
          <MenuItem
            key={option.label}
            value={option.value}
          >
            {option.label
          }</MenuItem>
        )}
        </Select>
        <form onSubmit={addEntry}>
            <TextField
              label="Description"
              fullWidth 
              value={description}
              onChange={({ target }) => setDescription(target.value)}
            />
            <TextField
              label="Date"
              fullWidth 
              value={date}
              onChange={({ target }) => setDate(target.value)}
            />
            <TextField
              label="Specialist"
              fullWidth 
              value={specialist}
              onChange={({ target }) => setSpecialist(target.value)}
            />
            <InputLabel style={{ marginTop: 20 }}>Healthcheck Rating</InputLabel>
            <Select
              label="HealthCheckRating"
              fullWidth
              value={healthCheckRating.toString()}
              onChange={onHealthCheckRatingChange}
            >
            {healthCheckRatingOptions.map(option =>
              <MenuItem
                key={option.label}
                value={option.value}
              >
                {option.label
              }</MenuItem>
            )}
            </Select>
            <TextField
              label="Diagnosis Codes"
              fullWidth 
              value={diagnosisCode}
              onChange={onDiagnosisCodeChange}
            />
          <Grid>
            <Grid item>
              <Button
                color="secondary"
                variant="contained"
                style={{ float: "left" }}
                type="button"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                style={{
                  float: "right",
                }}
                type="submit"
                variant="contained"
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    )
  case "OccupationalHealthcare":
    return (
      <div>
        <InputLabel style={{ marginTop: 20 }}>Entry Type</InputLabel>
        <Select
          label="Entry"
          fullWidth
          value={type}
          onChange={onEntryTypeChange}
        >
        {typeOptions.map(option =>
          <MenuItem
            key={option.label}
            value={option.value}
          >
            {option.label
          }</MenuItem>
        )}
        </Select>
        <form onSubmit={addEntry}>
            <TextField
              label="Description"
              fullWidth 
              value={description}
              onChange={({ target }) => setDescription(target.value)}
            />
            <TextField
              label="Date"
              fullWidth 
              value={date}
              onChange={({ target }) => setDate(target.value)}
            />
            <TextField
              label="Specialist"
              fullWidth 
              value={specialist}
              onChange={({ target }) => setSpecialist(target.value)}
            />
            <TextField
              label="Employer Name"
              fullWidth 
              value={employer}
              onChange={({ target }) => setEmployer(target.value)}
            />
            <TextField
              label="Sickleave Start"
              fullWidth 
              value={sickLeaveStartDate}
              onChange={({ target }) => setSickLeaveStartDate(target.value)}
            />
            <TextField
              label="Sickleave End"
              fullWidth 
              value={sickLeaveEndDate}
              onChange={({ target }) => setSickLeaveEndDate(target.value)}
            />
            <TextField
              label="Diagnosis Codes"
              fullWidth 
              value={diagnosisCode}
              onChange={onDiagnosisCodeChange}
            />
          <Grid>
            <Grid item>
              <Button
                color="secondary"
                variant="contained"
                style={{ float: "left" }}
                type="button"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                style={{
                  float: "right",
                }}
                type="submit"
                variant="contained"
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    )
  default:
    return null
  }
}

export default AddEntryForm;
