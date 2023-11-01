import React, {useEffect, useState} from "react";

export default function Calendar({ setSelectedDate }){

  /*
  function Calendar({ setSelectedDate }) {
  // ... existing code

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setSelectedDate(newDate);  // Update the selected date in parent component
  };

  // ... existing code

  // Update the onClick inside the daysArray.map
  <div onClick={() => {
    handleDateChange({
      month: date.month,
      day: day,
      year: date.year
    });
  }} className={"hover:bg-gray-500 cursor-pointer select-none"} key={day.id}>
    {day}
  </div>

  // ... existing code
  }
   */

  const [bottomOpen, setBottomOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const [date, setDate] = useState({
    month: "January",
    day: 1,
    year: 2023
  })

  const handleDateChange = newDate => {
    setDate(newDate);
    setSelectedDate(newDate);  // Update the selected date in parent component
  };

  const dropBottom = () => setBottomOpen(!bottomOpen);
  const dropMonth = () => setMonthOpen(!monthOpen);
  const dropYear = () => setYearOpen(!yearOpen);

  const daysOfWeek = ['S','M','T','W','T','F','S']; //use Date to map current date in month to week day
  const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthsWith30Days = ["April", "June", "September", "November"];
  let years = [];

  const currentYear = 2023;
  for(let i = 0; i < 2; i++){
    years.push(currentYear + i);
  }

  if(date.month === "February" && date.day > 28 || monthsWith30Days.includes(date.month) && date.day > 30){
    setDate({
      month: date.month,
      day: date.month === "February" ? 28 : 30,
      year: date.year
    })
  }

  let days;
  if(date.month === "February"){
    days = 28;
  } else if(monthsWith30Days.includes(date.month)){
    days = 30;
  } else {
    days = 31;
  }

  let daysArray = [];
  for(let i = 1; i <= days; i++){
    daysArray.push(i.toString());
  }

  {/*
  2d array, 12 x 31
  object with month as key and value as array of days

  let daysLess = 0
  if(february) daysLess = 3;
  months.february.length = months.february.length - daysLess;

  January, March, May, July, August, October, and December - 31 days
  April, June, September, and November - 30 days
  February - 28 days

  [31]
  [28]
  [31]
  {
    january: [...31],
    february: [...28],
    march: [...undefined]
  }

  2d array for each month (array of arrays)
  unshift() an amount of zeros "0" each loop
  amountOfZeroes = month.length - 28;
  january starts with 1

  or have a useState for array, and constantly unshift 0s to start
  if (amountOfZeroes = 7) shift(7);

  onclick{item !== 0 ? /anonymous function to change state object/ : ()=>{} }

  array of numbers to shift amount by

  {
  Jan: 31,
  Feb: 28,
  Mar: 31,
  Apr: 30
  }

  let zeroNums = [];
  for(const month of monthsArray){
    zeroNums.push(month.daysAmount - 28);
  }

  array of month objects
  key is name of month
  value is number of days
  access month in map by using object.keys
  push into zeroNums array using the value of each object

  */}

  return (
      <div className={"bg-coral text-white text-center p-5 my-5 w-full rounded-2xl overflow-hidden"}>
        <div onClick={dropBottom} className={"cursor-pointer select-none"}>
          {date.month} {date.day}, {date.year}
        </div>
        <div className={`${bottomOpen ? "bottom-open" : "bottom-closed"}`}>
          <div className={"flex flex-col rounded-2xl max-height no-scrollbar overflow-scroll"}>
            <div className={"grid grid-cols-2 gap-x-2 bg-dark-coral p-2"}>
              <div>
                <div onClick={dropMonth} className={"cursor-pointer select-none"}>{date.month}</div>
                <div className={`${monthOpen ? "month-open" : "month-closed"} grid grid-cols-1 overflow-hidden`}>
                  {monthsOfYear.map(month => (
                      <div onClick={() => {
                        handleDateChange({
                          month: month,
                          day: date.day,
                          year: date.year
                        });
                        dropMonth()
                      }} className={`${month === date.month ? "text-gray-400" : ""} text-sm p-2 border-white border-b-2 last:border-none cursor-pointer select-none`} key={month}>
                        {month}
                      </div>
                  ))}
                </div>
              </div>
              <div>
                <div onClick={dropYear} className={"cursor-pointer select-none"}>{date.year}</div>
                <div className={`${yearOpen ? "year-open" : "year-closed"} grid grid-cols-1 overflow-hidden`}>
                  {years.map(year => (
                      <div onClick={() => {
                        handleDateChange({
                          month: date.month,
                          day: date.day,
                          year: year
                        });
                        dropYear()
                      }} className={`${year === date.year ? "text-gray-400" : ""} text-sm p-2 border-white border-b-2 last:border-none cursor-pointer select-none`} key={year}>
                        {year}
                      </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={"grid grid-cols-7 bg-gray-400 p-2 pb-0"}>
              {daysOfWeek.map(weekday => (
                  <div key={weekday.id}>
                    {weekday}
                  </div>
              ))}
            </div>
            <div className={"grid grid-cols-7 bg-gray-400  pt-0 p-2"}>
              {daysArray.map( day => (
                  <div onClick={() => {
                    handleDateChange({
                      month: date.month,
                      day: day,
                      year: date.year
                    });
                  }} className={"hover:bg-gray-500 cursor-pointer select-none"} key={day.id}>
                    {day}
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}