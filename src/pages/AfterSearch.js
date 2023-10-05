import Image from 'next/image'
import Header from '../components/Header.js';
import Recommendations from '@/components/Recommendations.js';
import TriangleToggle from '../utils/TriangleToggle';

export default function AfterSearch() {
    return (
        <>
            <Header page="AfterSearch"/>
            <div className="pt-20 flex"> 
                <div className="w-1/4 h-screen">
                    <h2>Sidebar</h2> {/* Remove and add sidebar here */}
                </div>
                <div className="w-3/4">
                    <Recommendations TriangleToggle={TriangleToggle} />
                </div>
            </div>
        </>
    )
}
