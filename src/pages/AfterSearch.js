import Image from 'next/image'
import Header from '../components/Header.js';
import Filters from "../components/Filters";
import Recommendations from '@/components/Recommendations.js';
import TriangleToggle from '../utils/TriangleToggle';
import Sidebar from "@/components/Sidebar";


export default function AfterSearch() {
    return (
        <>

            <Header page="AfterSearch"/>
            <div className="flex min-h-screen h-full">
                <div className="w-1/4">
                    <Sidebar/>
                </div>
                <div className="w-3/4">
                    <Recommendations TriangleToggle={TriangleToggle} />
                </div>
            </div>

        </>
    )
}
