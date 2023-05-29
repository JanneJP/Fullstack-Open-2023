import { useState, useEffect } from 'react';

import { DiaryEntries } from "./components/DiaryEntries";
import { DiaryEntry } from './types';
import { getAllDiaryEntries } from './services/diaryEntryService';

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllDiaryEntries().then(data => {
      setDiaryEntries(data)
    })
  }, [])

  return (
    <div>
      <h1>Diary entries</h1>
      <DiaryEntries diaryEntries={diaryEntries} />
    </div>
  );
};

export default App;