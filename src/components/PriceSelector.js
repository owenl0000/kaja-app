import React, {useState} from "react";

export default function PriceSelector(props){
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

        <div className={"flex overflow-scroll no-scrollbar my-2 rounded-md w-full text-center"}>
          {itemArray.map((item) => (
              <div onClick={() => clickSelect(`${item}-div`)}
                   className={`${selected.active === `${item}-div` ? `active` : `inactive`} flex justify-center text-sm bg-coral text-white p-5 border-r border-white last:border-none overflow-hidden cursor-pointer`}
                   key={item.id}>
                {item}
              </div>
          ))}
        </div>

        <div>
          <div onClick={() => clickSelect("")} className={"bg-coral py-5 px-2 my-2 ml-3 rounded-md text-white text-center cursor-pointer reset"}>Reset</div>
        </div>

      </div>
  );
}