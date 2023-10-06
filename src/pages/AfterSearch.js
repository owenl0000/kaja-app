import Image from 'next/image'
import Header from '../components/Header.js';
import Filters from "../components/Filters";

export default function AfterSearch() {
    return (
        <>
          <div>
            <Header page="AfterSearch"/>
          </div>

          <div className={"m-5 font-trend"}>
            <button className={"rounded-3xl bg-coral p-2 text-white"}>Generate new locations</button>
            <Filters text={["Length of Trip", "Hours", "Days", "Weeks"]}/>
            <Filters text={["Price", "Low to High", "High to Low"]}/>
            <button className={"rounded-3xl bg-purple-500 p-2 text-white"}>Use This Itinerary</button>
          </div>

        </>
    )
}

