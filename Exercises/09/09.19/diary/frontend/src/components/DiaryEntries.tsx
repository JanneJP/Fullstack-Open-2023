import { DiaryEntry as DiaryEntryType } from "../types";
import { DiaryEntry } from "./DiaryEntry";

interface DiaryEntriesProps {
  diaryEntries: DiaryEntryType[]
}

export const DiaryEntries = (props: DiaryEntriesProps): JSX.Element => {
  
  return (
    <div>
      {props.diaryEntries.map(entry => <DiaryEntry key={entry.id} diaryEntry={entry}/>)}
    </div>
  );
};