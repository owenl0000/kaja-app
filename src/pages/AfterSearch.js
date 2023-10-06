import Image from 'next/image'
import Header from '../components/Header.js';
import Filters from "../components/Filters";
import Recommendations from '@/components/Recommendations.js';
import TriangleToggle from '../utils/TriangleToggle';


export default function AfterSearch() {
    return (
        <>

            <Header page="AfterSearch"/>
            <div className="pt-20 flex"> 
                <div className="w-1/4 h-screen">
                  <div className={"m-5 font-trend"}>
                    <button className={"rounded-3xl bg-coral p-2 text-white"}>Generate new locations</button>
                    <Filters text={["Length of Trip", "Hours", "Days", "Weeks"]}/>
                    <Filters text={["Price", "Low to High", "High to Low"]}/>
                    <button className={"rounded-3xl bg-purple-500 p-2 text-white"}>Use This Itinerary</button>
                  </div>
                </div>
                <div className="w-3/4">
                    <Recommendations TriangleToggle={TriangleToggle} />
                </div>
            </div>
        </>
    )
}
