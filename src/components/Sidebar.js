import React, {useState} from "react";
import TimeSelector from "./TimeSelector"

export default function Sidebar(){
  return (
      <div className={"p-3"}>
        <div className={"p-5 pb-0 mb-5 text-center text-2xl"}>Filters</div>
        <Price number={5} symbol={'$'} />
        <TimeSelector />
        <Calender />
      </div>
  );
}

function Price(props){

  const[selected, setSelected] = useState({});

  const clickSelect = (div) => {
    setSelected({active: div});
  }

  let character = props.symbol;
  const itemArray = [];

  for(let i = 0; i < props.number; i++){
    itemArray.push(character);
    character += character[0];
  }

  return (
      <div className={"flex w-full justify-center my-3 select-none"}>

        <div className={"flex overflow-scroll no-scrollbar my-2 rounded-2xl w-full text-center"}>
          {itemArray.map((item) => (
              <div onClick={() => clickSelect(`${item}-div`)}
                   className={`${selected.active === `${item}-div` ? `active` : `inactive`} flex justify-center text-sm bg-coral text-white p-5 border-r border-white last:border-none overflow-hidden cursor-pointer`}
                   key={item.id}>
                {item}
              </div>
          ))}
        </div>

        <div>
          <div onClick={() => clickSelect("")} className={"bg-coral py-5 px-2 my-2 ml-3 rounded-2xl text-white text-center cursor-pointer reset"}>Reset</div>
        </div>

      </div>
  );
}

function Calender(){

  const [bottomOpen, setBottomOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const [date, setDate] = useState({
    month: "January",
    day: 1,
    year: 2023
  })

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

  // let removeMonth = monthsOfYear.indexOf(date.month);
  // monthsOfYear.splice(removeMonth, 1);

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
                    setDate({
                      month: month,
                      day: date.day,
                      year: date.year
                    })
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
                      setDate({
                        month: date.month,
                        day: date.day,
                        year: year
                      })
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
                  setDate({
                    month: date.month,
                    day: day,
                    year: date.year
                  })
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

// function Date(){
//   const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//
//   const[month, setMonth] = useState(0);
//
//   const changeMonth = () => {
//     setMonth(month + 1);
//     if(month === months.length - 1){
//       setMonth(0);
//     }
//   }
//
//   console.log(months[month]);
//
//   return (
//       <div onClick={changeMonth} className={"text-center bg-coral p-5 m-5"}>
//         {months[month]}
//       </div>
//   );
// }