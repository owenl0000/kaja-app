import React from "react";
import TimeSelector from "./TimeSelector"
import Calendar from "./Calendar";
import PriceSelector from "@/components/PriceSelector";

export default function Sidebar(){
  return (
      <div className={"p-3"}>
        <div className={"p-5 pb-0 mb-5 text-center text-2xl"}>Filters</div>
        <PriceSelector number={5} symbol={'$'} />
        <TimeSelector />
        <Calendar />
      </div>
  );
}