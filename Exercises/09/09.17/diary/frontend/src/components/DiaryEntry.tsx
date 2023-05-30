import { DiaryEntry as DiaryEntryType } from "../types";

interface DiaryEntryProps {
  diaryEntry: DiaryEntryType
}
export const DiaryEntry = (props: DiaryEntryProps): JSX.Element => {
  
  return (
    <div>
      <h2>{props.diaryEntry.date}</h2>
      <p>Visibility: {props.diaryEntry.visibility}</p>
      <p>Weather: {props.diaryEntry.weather}</p>
    </div>
  );
};