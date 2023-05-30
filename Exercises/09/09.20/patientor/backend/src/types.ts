export interface DiagnosisData {
  code: string,
  name: string,
  latin?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Entry {

}

export interface PatientData {
  id: string,
  name: string,
  dateOfBirth: string,
  ssn: string,
  gender: string,
  occupation: string,
  entries: Entry[]
}

export enum Gender {
  male = 'male',
  female = 'female',
  other = 'other'
}

export type NonSensitivePatientData = Omit<PatientData, 'ssn' | 'entries'>;

export type NewPatientData = Omit<PatientData, 'id'>;