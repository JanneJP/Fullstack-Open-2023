import {
  Entry,
  NewPatient,
  Gender,
  NewDiagnosis,
  NewHealtcheckEntry,
  NewHospitalEntry,
  NewOccupationalHealthcareEntry,
  HealthCheckRating,
  Diagnosis,
  Discharge,
  SickLeave
} from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }

  return name;
};

const parseCode = (code: unknown): string => {
  if (!code || !isString(code)) {
    throw new Error('Incorrect or missing code');
  }

  return code;
};

const parseLatin = (latin: unknown): string => {
  if (!latin || !isString(latin)) {
    throw new Error('Incorrect or missing latin');
  }

  return latin;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }

  return date;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }

  return ssn;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};

const parseGender = (gender: unknown): string => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender');
  }

  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }

  return occupation;
};

export const toNewPatient = (object: unknown): NewPatient => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
    const newPatient: NewPatient = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: []
    };

    return newPatient;
  }

  throw new Error('Incorrect data: some fields are missing');
};

export const toNewDiagnosis = (object: unknown): NewDiagnosis => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('code' in object && 'name' in object) {
    let latin = undefined;

    if ('latin' in object) {
      latin = parseLatin(object.latin);
    }
    const newDiagnosis: NewDiagnosis = {
      code: parseCode(object.code),
      name: parseName(object.name),
      latin: latin
    };

    return newDiagnosis;
  }

  throw new Error('Incorrect data: some fields are missing');
};

const parseEmployerName = (employerName: unknown): string => {
  if (!employerName || !isString(employerName)) {
    throw new Error('Incorrect or missing employerName');
  }

  return employerName;
};

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error('Incorrect or missing description');
  }

  return description;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist');
  }

  return specialist;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const parseHealthCheckRating = (healthCheckRating: unknown): HealthCheckRating => {
  if (!healthCheckRating || !isString(healthCheckRating) || !(healthCheckRating in HealthCheckRating)) {
    throw new Error('Incorrect or missing healthCheckRating ' + healthCheckRating);
  }

  return HealthCheckRating[healthCheckRating as keyof typeof HealthCheckRating];
};

const parseDischarge = (discharge: unknown): Discharge => {
  if ( !discharge || typeof discharge !== 'object' ) {
    throw new Error('Missing discharge');
  }

  if (!('date' in discharge ) || !isString(discharge.date) || !isDate(discharge.date)) {
    throw new Error('Incorrect or missing date: ' + discharge);
  }

  if (!('criteria' in discharge ) || !isString(discharge.criteria)) {
    throw new Error('Incorrect or missing criteria: ' + discharge);
  }

  return discharge as Discharge;
};

const parseSickLeave = (sickLeave: unknown): SickLeave | undefined => {
  if (!sickLeave || typeof sickLeave !== 'object' || !('startDate' in sickLeave) || !('endDate' in sickLeave)) {

    return undefined;
  }

  if (!(isString(sickLeave.startDate) && isDate(sickLeave.startDate) && isString(sickLeave.endDate) && isDate(sickLeave.endDate))) {
    return undefined;
  }

  return sickLeave as SickLeave;
};

export const toNewEntry = (object: unknown): Entry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if (!('type' in object)) {
    throw new Error('Missing type parameter');
  }

  if (!('description' in object && 'date' in object && 'specialist' in object)) {
    throw new Error('Missing common parameter');
  }

  let diagnosisCodes = undefined;

  if ('diagnosisCodes' in object) {
    diagnosisCodes = parseDiagnosisCodes(object.diagnosisCodes);
  }

  switch (object.type) {
    case "HealthCheck":
      if ('healthCheckRating' in object) {
        const newHealtcheckEntry: NewHealtcheckEntry = {
          description: parseDescription(object.description),
          date: parseDate(object.date),
          specialist: parseSpecialist(object.specialist),
          diagnosisCodes: diagnosisCodes,
          type: 'HealthCheck',
          healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
        };

        return newHealtcheckEntry as Entry;
      } else {
        throw new Error('Missing healthCheckRating parameter');
      }
    case "Hospital":
      if ('discharge' in object) {
        const newHospitalEntry: NewHospitalEntry = {
          description: parseDescription(object.description),
          date: parseDate(object.date),
          specialist: parseSpecialist(object.specialist),
          diagnosisCodes: diagnosisCodes,
          type: 'Hospital',
          discharge: parseDischarge(object.discharge)
        };

        return newHospitalEntry as Entry;
      } else {
        throw new Error('Missing healthCheckRating parameter');
      }
    case "OccupationalHealthcare":
      if ('employerName' in object) {
        let sickLeave = undefined;

        if ('sickLeave' in object) {
          sickLeave = parseSickLeave(object.sickLeave);
        }

        const NewOccupationalHealthcareEntry: NewOccupationalHealthcareEntry = {
          description: parseDescription(object.description),
          date: parseDate(object.date),
          specialist: parseSpecialist(object.specialist),
          diagnosisCodes: diagnosisCodes,
          type: 'OccupationalHealthcare',
          employerName: parseEmployerName(object.employerName),
          sickLeave: sickLeave
        };

        return NewOccupationalHealthcareEntry as Entry;
      } else {
        throw new Error('Missing healthCheckRating parameter');
      }
    default:
      throw new Error('Invalid type');
  }
};
