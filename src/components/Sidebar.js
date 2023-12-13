import React, { useState } from "react";
import PriceSelector from "@/components/PriceSelector";
import Calendar from "./CalendarChange.js"
import ReviewSorter from "@/utils/ReviewSorter";
import Link from "next/link.js";

export default function Sidebar({ selectedDate, onDateChange, onSortChange, onPriceChange }){
  
  return (
    <div className="lg:flex lg:flex-row xl:flex-none xl:flex-col ">
      <div className={"p-4 pb-2 small:m-4 my-2 rounded-md border lg:w-1/2 xl:w-auto"}>
        <div className={"p-5 pt-2 pb-0 mb-3 text-center text-2xl"}>Sort By</div>
        <PriceSelector number={5} symbol={'$'} onPriceChange={onPriceChange}/>
        <ReviewSorter onSortChange={onSortChange}/>
      </div>
      <div className={"p-4 pb-2 small:m-4 my-2 rounded-md border lg:w-1/2 xl:w-auto"}>
        <div className={"p-5 pt-2 pb-0 mb-5 text-center text-2xl"}>Plan Your Day</div>
        <Calendar selectedDate={selectedDate} setSelectedDate={onDateChange}/>
        <div className={"bg-coral text-white text-center p-5 lg:px-5 sm:px-2 my-5 w-full rounded-md overflow-hidden font-mont"}>
          <Link href="/Planner" className="bg-coral p-5 cursor-pointer w-full inline text-off-white text-select">
                Go to Planner
          </Link>
        </div>
      </div>
    </div>
  );
}