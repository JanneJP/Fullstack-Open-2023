export interface DiaryEntry {
  id: string;
  date: string;
  visibility: string;
  weather: string;
  comment: string;
}

export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;