import React, {useState} from "react";
import arrow from "public/arrow.svg"

export default function Filters(props){

  let propsArray = props.text.slice();

  const [open, setOpen] = useState(false);

  const dropMenu = () => {
    setOpen(!open);
  }

  let filterArray = [];
  for(let i = 0; i < propsArray.length - 1; i++){
    filterArray.push(<FilterItem text={propsArray[i+1]}/>)
  }

  return (
   <div className={"m-2"}>
     <div>
       <div className={"flex items-center title-container cursor-pointer"} onClick={dropMenu}>
         <h1 className={"mb-2 mr-2"}>{propsArray[0]}</h1>
         <img src={arrow} alt={arrow} className={`h-2 rotate-90 ${open ? "open" : "closed"}`}/>
       </div>
       <div className={"filter-container"}>
         <ul className={`${open ? "open" : "closed"}`}>
           {filterArray}
         </ul>
       </div>
     </div>
   </div>
  );
}

const FilterItem = (props) => {
  return (
      <li className={"ml-2 pb-1 flex items-center relative"}>
        <div className={"mr-2 border-2 border-black p-1 h-1 cursor-pointer"}></div>
        <p className={"text-sm"}>{props.text}</p>
      </li>
  );
}