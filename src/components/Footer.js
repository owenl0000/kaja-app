
export default function Footer(){
  return (
        <div className={"grid grid-cols-1 lg:grid-cols-3 bg-dark-coral p-5 text-center"}>
          <div className={"grid grid-rows-3 rounded-3xl m-5 bg-[url('../public/chrysler-building.jpg')] bg-cover overflow-x-hidden shadow-lg shadow-black"}>
            <div className={"row-span-2 text-white text-3xl pl-2.5 pr-2.5"}>Sample Itinerary 1</div>
            <div className={"text-left text-white flex items-center rounded-b-3xl bg-black/60 p-5"}>
              <div>
                <h1>Visited:</h1>
                <ul className={"text-xs"}>
                  <li>Location 1</li>
                  <li>Location 2</li>
                  <li>Location 3</li>
                </ul>
              </div>
            </div>
          </div>
          <div className={"grid grid-rows-3 rounded-3xl m-5 bg-[url('../public/empire-state-building.jpg')] bg-cover overflow-x-hidden shadow-lg shadow-black"}>
            <div className={"row-span-2 text-white text-3xl pl-2.5 pr-2.5"}>Sample Itinerary 2</div>
            <div className={"text-left text-white flex items-center rounded-b-3xl bg-black/60 p-5"}>
              <div>
                <h1>Visited:</h1>
                <ul className={"text-xs"}>
                  <li>Location 1</li>
                  <li>Location 2</li>
                  <li>Location 3</li>
                </ul>
              </div>
            </div>
          </div>
          <div className={"grid grid-rows-3 rounded-3xl m-5 bg-[url('../public/world-trade-center.jpg')] bg-cover overflow-x-hidden shadow-lg shadow-black"}>
            <div className={"row-span-2 text-white text-3xl pl-2.5 pr-2.5"}>Sample Itinerary 3</div>
            <div className={"text-left text-white flex items-center rounded-b-3xl bg-black/60 p-5"}>
              <div>
                <h1>Visited:</h1>
                <ul className={"text-xs"}>
                  <li>Location 1</li>
                  <li>Location 2</li>
                  <li>Location 3</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
  )
}