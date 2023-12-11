import React from "react";
import PriceSelector from "@/components/PriceSelector";
import Calendar from "./CalendarChange.js"
import ReviewSorter from "@/utils/ReviewSorter";

export default function Sidebar({ selectedDate, onDateChange, onSortOrderChange }){

  return (
    <div>
      <div className={"p-4 pb-2 m-4 mr-2 rounded-md border"}>
        <div className={"p-5 pt-2 pb-0 mb-5 text-center text-2xl"}>Sort By</div>
        <PriceSelector number={5} symbol={'$'} />
        <ReviewSorter onChange={onSortOrderChange}/>
        
      </div>
      <div className={"p-4 pb-2 m-4 mr-2 rounded-md border"}>
        <div className={"p-5 pt-2 pb-0 mb-5 text-center text-2xl"}>Select Date</div>
        <Calendar selectedDate={selectedDate} setSelectedDate={onDateChange}/>
      </div>
    </div>
  );
}

