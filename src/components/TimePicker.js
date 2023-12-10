import React, { useState, useEffect } from 'react';

const TimePicker = ({ timeFrame, onChange, uniqueKey }) => {
  // Function to parse the time string
  const parseTimeFrame = (timeFrameString) => {
    if (!timeFrameString) {
        return { startHour: '12', startMinute: '00', startPeriod: 'AM', endHour: '1', endMinute: '00', endPeriod: 'PM' };
    }
    const [startTime, endTime] = timeFrameString.split(' to ');
    const [startHour, startRest] = startTime.split(':');
    const [startMinute, startPeriod] = startRest.split(' ');
    const [endHour, endRest] = endTime.split(':');
    const [endMinute, endPeriod] = endRest.split(' ');
    return { startHour, startMinute, startPeriod, endHour, endMinute, endPeriod };
  };

  const [time, setTime] = useState(parseTimeFrame(timeFrame));

  // Effect to update local state when timeFrame prop changes
  useEffect(() => {
    setTime(parseTimeFrame(timeFrame));
  }, [timeFrame, uniqueKey]);

  // Function to update the time state and trigger onChange
  const updateTime = (updatedTime) => {
    setTime(updatedTime);
    const newTimeFrame = `${updatedTime.startHour}:${updatedTime.startMinute} ${updatedTime.startPeriod} to ${updatedTime.endHour}:${updatedTime.endMinute} ${updatedTime.endPeriod}`;
    onChange(newTimeFrame);
  };

  const validateHour = (hour) => {
    let validHour = parseInt(hour, 10);
    if (isNaN(validHour) || validHour < 1 || validHour > 12) {
      return '';
    }
    return validHour.toString();
  };

  const validateMinute = (minute) => {
    let validMinute = parseInt(minute, 10);
    if (isNaN(validMinute) || validMinute < 0 || validMinute > 59) {
      return '';
    }
    return validMinute.toString().padStart(2, '0');
  };

  return (
    <div className="time-picker p-2 lg:px-6 grid lg:grid-cols-3 sm:grid-cols-1">
      <div className="time-section">
        <input 
          type="text" 
          className="time-input"
          value={time.startHour} 
          onChange={(e) => updateTime({ ...time, startHour: validateHour(e.target.value) })} 
        />
        <span className="time-colon">:</span>
        <input 
          type="text" 
          className="time-input" 
          value={time.startMinute} 
          onChange={(e) => updateTime({ ...time, startMinute: validateMinute(e.target.value) })} 
        />
        <select 
          className="time-select" 
          value={time.startPeriod}
          onChange={(e) => updateTime({ ...time, startPeriod: e.target.value })}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>

      <div className="time-to sm:text-center">to</div>

      <div className="time-section">
        <input 
          type="text" 
          className="time-input" 
          value={time.endHour} 
          onChange={(e) => updateTime({ ...time, endHour: validateHour(e.target.value) })} 
        />
        <span className="time-colon">:</span>
        <input 
          type="text" 
          className="time-input" 
          value={time.endMinute} 
          onChange={(e) => updateTime({ ...time, endMinute: validateMinute(e.target.value) })} 
        />
        <select 
          className="time-select"
          value={time.endPeriod}
          onChange={(e) => updateTime({ ...time, endPeriod: e.target.value })}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

export default TimePicker;
