export default function Sidebar(){
  return (
      <div className={"flex flex-col align-middle"}>
        <div className={"p-5 pb-0 text-center text-2xl"}>Filters</div>
        <Price number={5} symbol={'$'} />
      </div>
  );
}

function Price(props){

  let character = props.symbol;
  let priceArray = [];

  for(let i = 0; i < props.number; i++){
    priceArray.push(character);
    character += character[0];
  }

  return (
      <div className={`grid lg:grid-cols-${props.number} md:grid-cols-1 text-white bg-coral m-5 rounded-2xl overflow-hidden`}>
        {priceArray.map((item) => (
            <div key={item.id} className={`flex justify-center align-middle p-5 hover:bg-[var(--light-coral)] active:bg-[var(--dark-coral)] last:border-none md:border-b lg:border-r lg:border-b-0 border-white cursor-pointer caret-transparent`}>
              {item}
            </div>
        ))}
      </div>
  );
}