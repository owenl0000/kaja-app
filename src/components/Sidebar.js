import React, {useState} from "react";

export default function Sidebar(){
  return (
      <div className={"flex flex-col align-middle"}>
        <div className={"p-5 pb-0 mb-5 text-center text-2xl"}>Filters</div>
        <Price number={5} symbol={'$'} />
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
      <div className={"flex w-full justify-center"}>

        <div className={"flex overflow-hidden m-2 rounded-2xl w-full text-center"}>
          {itemArray.map((item) => (
              <div onClick={() => clickSelect(`${item}-div`)}
                   className={`${selected.active === `${item}-div` ? `active` : `inactive`} flex justify-center text-sm bg-coral text-white p-5 border-r border-white last:border-none overflow-hidden cursor-pointer`}
                   key={item.id}>
                {item}
              </div>
          ))}
        </div>

        <div>
          <div onClick={() => clickSelect("")} className={"bg-coral py-5 px-2 m-2 ml-0 rounded-2xl text-white text-center cursor-pointer reset"}>Reset</div>
        </div>

      </div>
  );
}