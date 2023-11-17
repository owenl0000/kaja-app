import React from "react";
import TimeSelector from "./TimeSelector"
import PriceSelector from "@/components/PriceSelector";
import Calendar from "./CalendarChange.js"

export default function Sidebar(){
  return (
      <div className={"p-3"}>
        <div className={"p-5 pb-0 pt-7 mb-5 text-center text-2xl"}>Filters</div>
        <PriceSelector number={5} symbol={'$'} />
        <TimeSelector />
        <Calendar />
      </div>
  );
}