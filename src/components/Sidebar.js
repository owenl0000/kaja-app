import React from "react";
import TimeSelector from "./TimeSelector"
import PriceSelector from "@/components/PriceSelector";
import Calendar from "./CalendarChange.js"

export default function Sidebar(){
  return (
      <div className={"p-4 pb-2 m-4 mr-2 rounded-md border"}>
        <div className={"p-5 pt-2 pb-0 mb-5 text-center text-2xl"}>Filters</div>
        <PriceSelector number={5} symbol={'$'} />
        <TimeSelector />
        <Calendar />
      </div>
  );
}