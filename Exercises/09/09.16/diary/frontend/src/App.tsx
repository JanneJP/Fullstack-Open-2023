import { useState, useEffect } from 'react';

import { DiaryEntries } from "./components/DiaryEntries";
import { DiaryEntry } from './types';
import { getAllDiaryEntries } from './services/diaryEntryService';
import { createDiaryEntry } from './services/diaryEntryService';

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllDiaryEntries().then(data => {
      setDiaryEntries(data)
    })
  }, [])

  const DiaryEntryForm = (): JSX.Element => {
    const [date, setDate] = useState('');
    const [visibility, setVisibility] = useState('');
    const [weather, setWeather] = useState('');
    const [comment, setComment] = useState('');
  
    const diaryEntryCreation = (event: React.SyntheticEvent) => {
      event.preventDefault();
  
      createDiaryEntry({ date: date, visibility: visibility, weather: weather, comment: comment }).then(data => {
        console.log(data)
        setDiaryEntries(diaryEntries.concat(data))
      })
    };
  
    return (
      <div>
        <form onSubmit={diaryEntryCreation}>
          date
          <input
            value={date}
            onChange={(event) => setDate(event.target.value)} 
          />
          visibility
          <input
            value={visibility}
            onChange={(event) => setVisibility(event.target.value)} 
          />
          weather
          <input
            value={weather}
            onChange={(event) => setWeather(event.target.value)} 
          />
          comment
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)} 
          />
          <button type='submit'>add</button>
        </form>
      </div>
    );
  };

  return (
    <div>
      <h1>Diary entries</h1>
      <DiaryEntryForm />
      <DiaryEntries diaryEntries={diaryEntries} />
    </div>
  );
};

export default App;