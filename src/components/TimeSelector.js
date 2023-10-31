import React, {useState} from "react";
import arrow from "/public/arrow.svg"

export default function TimeSelector(){
  const [time, setTime] = useState({
    daytime: "am",
    hours: 12,
    minutes: 0,
  });

  const [flipHour, setHourFlip] = useState(false);
  const [flipMinute, setMinuteFlip] = useState(false);
  const [flipDaytime, setDaytimeFlip] = useState(false);

  const adjustTime = (hourChange, minuteChange, daytimeChange) => {
    const newMinutes = (time.minutes + minuteChange + 60) % 60;
    const hourAdjustment = Math.floor((time.minutes + minuteChange) / 60) + hourChange;
    const newHours = ((time.hours + hourAdjustment + 12) % 12) || 12;
    //const newDaytime = hourChange ? ((time.hours === (hourChange > 0 ? 11 : 12) /*<- this is the issue area*/ ? (time.daytime === "pm" ? "am" : "pm") : time.daytime)) : (daytimeChange ? (time.daytime === "pm" ? "am" : "pm") : time.daytime);
    //issue with transition from 11:59 to 12:00 does not change dayTime

    let newDaytime = time.daytime;
    let cuspHours = 11;

    if(hourAdjustment){
      if(hourChange < 0 || minuteChange < 0){
        cuspHours = 12;
      }
      if(time.hours === cuspHours){
        newDaytime = time.daytime === "pm" ? "am" : "pm";
      } else {
        newDaytime = time.daytime;
      }
    } else {
      if(minuteChange){
        if(time.hours === 12 && (time.minutes === 59 && newMinutes === 0)){
          newDaytime = time.daytime === "pm" ? "am" : "pm";
        }
      } else if (daytimeChange) {
        newDaytime = time.daytime === "pm" ? "am" : "pm";
      } else {
        newDaytime = time.daytime;
      }
    }

    if(time.hours !== newHours){
      setHourFlip(!flipHour);
    }
    if(time.minutes !== newMinutes){
      setMinuteFlip(!flipMinute);
    }
    if(time.daytime !== newDaytime){
      setDaytimeFlip(!flipDaytime);
    }

    setTime({
      daytime: newDaytime,
      hours: newHours,
      minutes: newMinutes,
    });
  };

  const addHours = () => {
    adjustTime(1, 0 , 0);
  };

  const subtractHours = () => {
    adjustTime(-1, 0 , 0);
  };

  const addMinutes = () => {
    adjustTime(0, 1, 0);
  };

  const subtractMinutes = () => {
    adjustTime(0, -1 , 0);
  };

  const changeDaytime = () => {
    adjustTime(0,0,1);
  };

  const imageStyles = "h-2 invert";
  const containerStyles = "flex justify-center rounded-2xl cursor-pointer active:scale-[130%]";

  return (
      <div className={"flex justify-center w-full bg-coral rounded-2xl p-2 select-none"}>
        <div className={"grid grid-cols-3 text-center gap-y-1 text-white w-1/3"}> {/*need to make responsive*/}

          <div onClick={addHours} className={containerStyles}><img src={arrow} className={`${imageStyles} rotate-[270deg]`} alt={"arrow"}/></div>
          <div onClick={addMinutes} className={containerStyles}><img src={arrow} className={`${imageStyles} rotate-[270deg]`} alt={"arrow"}/></div>
          <div onClick={changeDaytime} className={containerStyles}><img src={arrow} className={`${imageStyles} rotate-[270deg]`} alt={"arrow"}/></div>

          <div className={`preflip ${flipHour ? 'flip' : ''}`}>{time.hours}</div>
          <div className={`preflip ${flipMinute ? 'flip' : ''}`}>{time.minutes.toString().length === 1 ? '0' + time.minutes.toString() : time.minutes}</div>
          <div className={`preflip ${flipDaytime ? 'flip' : ''}`}>{time.daytime}</div>

          <div onClick={subtractHours} className={containerStyles}><img src={arrow} className={`${imageStyles} rotate-90`} alt={"arrow"}/></div>
          <div onClick={subtractMinutes} className={containerStyles}><img src={arrow} className={`${imageStyles} rotate-90`} alt={"arrow"}/></div>
          <div onClick={changeDaytime} className={containerStyles}><img src={arrow} className={`${imageStyles} rotate-90`} alt={"arrow"}/></div>

        </div>
      </div>
  );
}
