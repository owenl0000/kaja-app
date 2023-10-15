// components/TimePicker.js
import React, { useState } from 'react';

const TimePicker = ({ onChange }) => {
  const [startHour, setStartHour] = useState('12');
  const [startMinute, setStartMinute] = useState('00');
  const [startPeriod, setStartPeriod] = useState('AM');

  const [endHour, setEndHour] = useState('1');
  const [endMinute, setEndMinute] = useState('00');
  const [endPeriod, setEndPeriod] = useState('PM');

  const validateHour = (hour) => {
    let validHour = parseInt(hour);
    return (validHour >= 1 && validHour <= 12) ? validHour.toString() : '';
  };

  const validateMinute = (minute) => {
    let validMinute = parseInt(minute);
    return (validMinute >= 0 && validMinute <= 59) ? validMinute.toString().padStart(2, '0') : '';
  };

  const handleTimeChange = () => {
    const startTime = `${startHour}:${startMinute} ${startPeriod}`;
    const endTime = `${endHour}:${endMinute} ${endPeriod}`;
    const timeFrame = `${startTime} to ${endTime}`;
    onChange(timeFrame);
  };

  return (
    <div className="time-picker">
      <div className="time-section">
        <input 
          type="text" 
          className="time-input" 
          value={startHour} 
          onChange={(e) => { setStartHour(validateHour(e.target.value)); handleTimeChange(); }} 
        />
        <span className="time-colon">:</span>
        <input 
          type="text" 
          className="time-input" 
          value={startMinute} 
          onChange={(e) => { setStartMinute(validateMinute(e.target.value)); handleTimeChange(); }} 
        />
        <select className="time-select" onChange={(e) => { setStartPeriod(e.target.value); handleTimeChange(); }} value={startPeriod}>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
      <span className="time-to">to</span>
      <div className="time-section">
        <input 
          type="text" 
          className="time-input" 
          value={endHour} 
          onChange={(e) => { setEndHour(validateHour(e.target.value)); handleTimeChange(); }} 
        />
        <span className="time-colon">:</span>
        <input 
          type="text" 
          className="time-input" 
          value={endMinute} 
          onChange={(e) => { setEndMinute(validateMinute(e.target.value)); handleTimeChange(); }} 
        />
        <select className="time-select" onChange={(e) => { setEndPeriod(e.target.value); handleTimeChange(); }} value={endPeriod}>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

export default TimePicker;
