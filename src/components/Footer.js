
export default function Footer(){
  return (
        <div className={"grid lg:grid-cols-3 sm:grid-cols-1 lg:bg-transparent sm:bg-[var(--dark-coral)] p-5 text-center "}>
          <div className={"grid grid-rows-3 rounded-3xl m-5 bg-[url('../public/images/soho.webp')] bg-cover overflow-x-hidden shadow-xl shadow-black no-scrollbar max-h-[500px]"}>
            <div className={"row-span-2 text-white text-2xl pl-2.5 pr-2.5 py-2 flex justify-start items-end text-shadow"}>Places to Visit at NYC</div>
            <div className={"text-left text-white flex rounded-b-3xl items-center bg-black/40 p-5 backdrop-blur-sm"}>
              <div>
                <h1>Visited: New York City</h1>
                <ul className={"text-xs"}>
                  <li>New York Signature Brunch Cruise Pier 15</li>
                  <li>Soho Grand Hotel</li>
                  <li>Jane Restaurant West Village</li>
                </ul>
              </div>
            </div>
          </div>
          <div className={"grid grid-rows-3 rounded-3xl m-5 bg-[url('../public/images/toronto.webp')] bg-cover overflow-x-hidden shadow-xl shadow-black max-h-[500px]"}>
            <div className={"row-span-2 text-white text-2xl pl-2.5 pr-2.5 py-2 flex justify-start items-end text-shadow"}>Toronto Date</div>
            <div className={"text-left text-white flex rounded-b-3xl items-center bg-black/40 p-5 backdrop-blur-sm"}>
              <div>
                <h1>Visited: Toronto</h1>
                <ul className={"text-xs"}>
                  <li>Cactus Club Cafe</li>
                  <li>Scotiabank Theatre</li>
                  <li>Storm Crow Manor</li>
                </ul>
              </div>
            </div>
          </div>
          <div className={"grid grid-rows-3 rounded-3xl m-5 bg-[url('../public/images/honolulu.webp')] bg-cover overflow-x-hidden shadow-xl shadow-black max-h-[500px]"}>
            <div className={"row-span-2 text-white text-2xl pl-2.5 pr-2.5 py-2 flex justify-start items-end text-shadow"}>Honolulu Plans</div>
            <div className={"text-left text-white rounded-b-3xl flex items-center bg-black/40 p-5 backdrop-blur-sm"}>
              <div>
                <h1>Visited: Honolulu</h1>
                <ul className={"text-xs"}>
                  <li>Encore Saloon</li>
                  <li>Hilton Hawaiian Village Waikiki Beach Resort</li>
                  <li>The Tchin Tchin Bar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
  )
}