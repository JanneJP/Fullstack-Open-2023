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

  const onVisibilityOptionChange = (event: React.SyntheticEvent) => {
    setVisibility((event.target as HTMLInputElement).value)
  }

  const onWeatherOptionChange = (event: React.SyntheticEvent) => {
    setWeather((event.target as HTMLInputElement).value)
  }

  return (
    <div>
      <h1>Diary entries</h1>
      <Notification notification={notification} />
      <div>
        <form onSubmit={diaryEntryCreation}>
          date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)} 
          />
          <fieldset>
            <legend>Visibility:</legend>
            <input
              type="radio"
              name="visibility"
              value="great"
              id="vis_great"
              checked={visibility === "great"}
              onChange={onVisibilityOptionChange}
            />
            <label htmlFor="vis_great">Great</label>
            <input
              type="radio"
              name="visibility"
              value="good"
              id="vis_good"
              checked={visibility === "good"}
              onChange={onVisibilityOptionChange}
            />
            <label htmlFor="vis_good">Good</label>
            <input
              type="radio"
              name="visibility"
              value="ok"
              id="vis_ok"
              checked={visibility === "ok"}
              onChange={onVisibilityOptionChange}
            />
            <label htmlFor="vis_ok">Ok</label>
            <input
              type="radio"
              name="visibility"
              value="poor"
              id="vis_poor"
              checked={visibility === "poor"}
              onChange={onVisibilityOptionChange}
            />
            <label htmlFor="vis_poor">Poor</label>
          </fieldset>
          <fieldset>
            <legend>Weather:</legend>
            <input
              type="radio"
              name="weather"
              value="sunny"
              id="weather_sunny"
              checked={weather === "sunny"}
              onChange={onWeatherOptionChange}
            />
            <label htmlFor="weather_sunny">Sunny</label>
            <input
              type="radio"
              name="weather"
              value="rainy"
              id="weather_rainy"
              checked={weather === "rainy"}
              onChange={onWeatherOptionChange}
            />
            <label htmlFor="weather_rainy">Rainy</label>
            <input
              type="radio"
              name="weather"
              value="cloudy"
              id="weather_cloudy"
              checked={weather === "cloudy"}
              onChange={onWeatherOptionChange}
            />
            <label htmlFor="weather_cloudy">Cloudy</label>
            <input
              type="radio"
              name="weather"
              value="stormy"
              id="weather_stormy"
              checked={weather === "stormy"}
              onChange={onWeatherOptionChange}
            />
            <label htmlFor="weather_stormy">Stormy</label>
            <input
              type="radio"
              name="weather"
              value="windy"
              id="weather_windy"
              checked={weather === "windy"}
              onChange={onWeatherOptionChange}
            />
            <label htmlFor="weather_windy">Windy</label>
          </fieldset>
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