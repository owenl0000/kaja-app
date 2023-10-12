import Image from 'next/image'
import Header from '../components/Header.js';
import Filters from "../components/Filters";
import Sidebar from "@/components/Sidebar";
import dynamic from 'next/dynamic';


export default function AfterSearch() {
    const DraggableSectionsWrapper = dynamic(
        () => import('@/components/DraggableSectionsWrapper'),
        { ssr: false }
      );
      
    return (
        <>

            <Header page="AfterSearch"/>
            <div className="flex min-h-screen h-full">
                <div className="w-1/4">
                    <Sidebar />
                </div>
                <div className="w-3/4">
                    <DraggableSectionsWrapper />
                </div>
            </div>

        </>
    )
}
