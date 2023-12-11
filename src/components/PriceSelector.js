import React, {useState} from "react";

export default function PriceSelector({ symbol, number, onPriceChange }) {
  const [selected, setSelected] = useState({});

  const clickSelect = (priceLevel) => {
      setSelected({ active: priceLevel });
      onPriceChange(priceLevel.split('-')[0]); // Pass the selected price level to the parent
  };

  let character = symbol;
  const itemArray = [];

  for (let i = 0; i < number; i++) {
      itemArray.push(character);
      character += symbol[0];
  }

  return (
      <div className={"flex w-full justify-center my-3 select-none"}>
          <div className={"flex overflow-scroll no-scrollbar my-2 rounded-md w-full text-center"}>
              {itemArray.map((item, index) => (
                  <div 
                      onClick={() => clickSelect(`${item}-div`)}
                      className={`${selected.active === `${item}-div` ? 'active' : 'inactive'} flex justify-center text-sm bg-coral text-white p-5 border-r border-white last:border-none overflow-hidden cursor-pointer`}
                      key={index}>
                      {item}
                  </div>
              ))}
          </div>
          <div>
              <div 
                  onClick={() => clickSelect('')} 
                  className={"bg-coral py-5 px-2 my-2 ml-3 rounded-md text-white text-center cursor-pointer reset"}>
                  Reset
              </div>
          </div>
      </div>
  );
}
