import React, {useEffect, useState} from "react";

export default function Calendar({ selectedDate, setSelectedDate }){

  const monthObject = {
    January: 31,
    February: 28,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31
  };

  
  const [bottomOpen, setBottomOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const[stateArray, setStateArray] = useState([]);
  const[unshiftArray, setUnshiftArray] = useState([]);

  const currentDate = new Date;

  // const [date, setDate] = useState({
  //   month: "January", //setSelectedDate.month
  //   day: 1,           //setSelectedDate.day
  //   year: 2023        //setSelectedDate.year
  // })

  const [date, setDate] = useState({
    month: Object.keys(monthObject)[currentDate.getMonth()], //setSelectedDate.month
    day: currentDate.getDate(),           //setSelectedDate.day
    year: currentDate.getFullYear(),        //setSelectedDate.year
  })

  const handleDateChange = newDate => {
    setDate(newDate);
    if (setSelectedDate) {  // Check if setSelectedDate is provided
      setSelectedDate(newDate);  // Update the selected date in parent component
    }
  };

  const dropBottom = () => setBottomOpen(!bottomOpen);
  const dropMonth = () => setMonthOpen(!monthOpen);
  const dropYear = () => setYearOpen(!yearOpen);

  useEffect(() => {
    if(!bottomOpen){
      setMonthOpen(false);
      setYearOpen(false);
    }
  }, [bottomOpen]);

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

  let dayArray = [];
  for(let i = 1; i <= days; i++){
    dayArray.push(i);
  }

  const calculateUnshift = () => {

    let unshiftAmount = monthObject[date.month] - 28;

    let innerArray = [];
    for(let i = 0; i < unshiftAmount; i++) {
      innerArray.push('0');
    }

    if(unshiftArray.length >= 7){
      unshiftArray.length = unshiftArray.length % 7;
    }

    if(monthsOfYear)

    setUnshiftArray([...innerArray, ...unshiftArray]);
    console.log(unshiftArray);
  }

  useEffect(() => {
    calculateUnshift();
    setStateArray([...unshiftArray, ...dayArray]);
  }, [date.month]);

  return (
      <div className={"bg-coral text-white text-center p-5 lg:px-5 sm:px-2 my-5 w-full rounded-md overflow-hidden"}>
        <div onClick={dropBottom} className={"cursor-pointer select-none"}>
          {date.month} {date.day}, {date.year}
        </div>
        <div className={`${bottomOpen ? "bottom-open" : "bottom-closed"} sm:text-xs lg:text-base`}>
          <div className={"flex flex-col rounded-md max-height no-scrollbar overflow-scroll"}>
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
                      }} className={`${month === date.month ? "text-gray-400" : ""} sm:text-[0.5rem] lg:text-base lg:p-2 sm:p-0 sm:py-1 lg:py-0 border-white lg:border-b-2 sm:border-none last:border-none cursor-pointer select-none`} key={month}>
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
                      }} className={`${year === date.year ? "text-gray-400" : ""} sm:text-[0.5rem] lg:text-base lg:p-2 sm:p-0 sm:py-1 lg:py-0 border-white lg:border-b-2 sm:border-none  last:border-none cursor-pointer select-none`} key={year}>
                        {year}
                      </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={"grid grid-cols-7 sm:pb-2 lg:pb-0 gap-x-1 bg-gray-400 p-2 pb-0 select-none"}>
              {daysOfWeek.map(weekday => (
                  <div key={weekday.id}>
                    {weekday}
                  </div>
              ))}
            </div>
            <div className={"grid grid-cols-7 sm:gap-y-2 gap-x-1 lg:gap-y-0 bg-gray-400 pt-0 p-2"}>
              {stateArray.map( day => (
                  <div onClick={() => {
                    handleDateChange({
                      month: date.month,
                      day: day,
                      year: date.year
                    });
                    dropBottom();
                  }} className={`${day === '0' ? "invisible" : ""} rounded-sm hover:bg-gray-500 cursor-pointer select-none`} key={day.id}>
                    {day}
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}

{/*
  calendar development

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