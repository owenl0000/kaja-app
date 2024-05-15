import { useLoadScript } from "@react-google-maps/api";
import Map from "./Map";
import { useState } from "react"

export default function MapLoader({ addresses, selectedDate, housingData, updateTrigger}) {
    const [ libraries ] = useState(['places']);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div className="flex justify-center items-center h-64"><div className="loader"></div></div>;

    return (
        <>
            <div className="hidden md:block">
                <Map addresses={addresses} selectedDate={selectedDate} updateTrigger={updateTrigger} />
            </div>
            <div className="md:hidden text-center p-4">
                Sorry, the map feature isn&apos;t available for mobile devices yet.
            </div>
        </>
    );
}
