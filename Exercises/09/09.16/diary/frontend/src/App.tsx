import { useState, useEffect } from 'react';

import { DiaryEntries } from "./components/DiaryEntries";
import { DiaryEntry } from './types';
import { getAllDiaryEntries } from './services/diaryEntryService';
import { createDiaryEntry } from './services/diaryEntryService';
import { Notification } from './components/Notification';

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState('');
  const [weather, setWeather] = useState('');
  const [comment, setComment] = useState('');

  const [notification, setNotification] = useState('');

  useEffect(() => {
    getAllDiaryEntries().then(data => {
      setDiaryEntries(data)
    })
  }, [])

  const diaryEntryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();

    createDiaryEntry({ date: date, visibility: visibility, weather: weather, comment: comment }).then(data => {
      console.log(data)
      setDiaryEntries(diaryEntries.concat(data))

      setNotification('New entry added!')
      setTimeout(() => {
        setNotification('')
      }, 5000)

      setDate('')
      setVisibility('')
      setWeather('')
      setComment('')
    }).catch(error => {
      console.log(error)
      setNotification(error.response.data)
      setTimeout(() => {
        setNotification('')
      }, 5000)
    })
  };

  return (
    <div>
      <h1>Diary entries</h1>
      <Notification notification={notification} />
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
      <DiaryEntries diaryEntries={diaryEntries} />
    </div>
  );
};

export default App;