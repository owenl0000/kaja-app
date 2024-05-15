import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { createMarkerIcon } from '../utils/markerUtils';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./MapPlaces";
import Distance from "./Distance";
import DestinationSelect from "./DestinationSelect";
import TravelModeSelector from "./TravelModeSelector";
import { updateHousingCoordinates, getPlaceData } from '@/utils/MapUtils';

export default function Map({ addresses, selectedDate, updateTrigger }) {
    const [markers, setMarkers] = useState([]);
    const [housing, setHousing] = useState();
    const [directions, setDirections] = useState({ routes: [] });
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
    const [destination, setDestination] = useState();
    const [starting, setStarting] = useState();
    const [travelMode, setTravelMode] = useState(google.maps.TravelMode.DRIVING);
    const mapRef = useRef();
    const center = useMemo(() => ({ lat: 43, lng:-80 }), []);
    const [mapCenter, setMapCenter] = useState(center);
    const options = useMemo(() => ({
        mapId: "eae82c43d0c21783",
        disableDefaultUI: true,
        clickableIcons: false
    }), []);
    //console.log(addresses)
    //console.log("Starting", starting);
    //console.log("Destination: ", destination);
    console.log("Markers ", markers);
    //console.log("Housing", housing)
    const onLoad = useCallback(map => (mapRef.current = map), []);

    //console.log("MARKERS::", markers)
    console.log("housing", housing)

    
   
    //housing pointers
    useEffect(() => {
        const initializeHousingData = async () => {
            const housingData = JSON.parse(localStorage.getItem('housingData')) || {};
            const housingForDate = housingData[selectedDate] || [];
            
            // This will store the updated housing entries with their coordinates.
            const updatedHousingEntries = [];
    
            for (const entry of housingForDate) {
                console.log("entry: ",entry)
                if (entry.address && entry.address.trim() !== '' && (!entry.lat || !entry.lng)) {
                    // Update coordinates only if they are missing
                    const coords = await updateHousingCoordinates(entry.address, selectedDate);
                    if (coords.lat && coords.lng) {
                        updatedHousingEntries.push({ ...entry, ...coords });
                    } else {
                        updatedHousingEntries.push({ ...entry, lat: null, lng: null }); // Explicitly set null if update fails
                    }
                } else if (entry.lat && entry.lng && typeof entry.lat === 'number' && typeof entry.lng === 'number') {
                    updatedHousingEntries.push(entry);
                }
            }
            
            if(updatedHousingEntries.length === 0) {
                delete housingData[selectedDate];
            }
            else {
                housingData[selectedDate] = updatedHousingEntries;
            }
            // Update the local storage with the new housing data for the selected date
            console.log("housingEntre",updatedHousingEntries)
            localStorage.setItem('housingData', JSON.stringify(housingData));
    
            // Update the state to trigger a re-render with the new housing data
            console.log("initializeHousingData ", updatedHousingEntries)
            setHousing(updatedHousingEntries);

            setDirections({ routes: [] });
            setStarting(null);
            setDestination(null);
        };
    
        initializeHousingData();
    }, [updateTrigger, selectedDate]);
    
    

    //Directions
    const fetchDirections = async () => {
        if (!starting || !destination || !travelMode) {
            console.log("Required data not available for fetching directions");
            
            return; // Exit if data is not available
        }
        console.log("Starting", starting)
        const directionsService = new google.maps.DirectionsService();
        console.log("Fetching directions with travel mode:", travelMode);

        try {
            const response = await directionsService.route({
                origin: starting,
                destination: destination,
                travelMode: travelMode,
                provideRouteAlternatives: true,
            
            });

            if (response.status === 'OK') {
                setDirections(response);
                console.log("Directions fetched successfully", response);
            } else {
                console.error("Directions API returned an error:", response.status);
            }
        } catch (error) {
            console.error("Error during fetching directions:", error);
        }
    };

    useEffect(() => {
        if(starting && destination) {
        fetchDirections();
        }
    }, [starting, destination, travelMode]);

    const renderSelectedRoute = () => {
        if (!directions || !directions.routes || directions.routes.length === 0 || selectedRouteIndex >= directions.routes.length) {
            return null; 
        }


        const selectedDirections = {
            ...directions,
            routes: [directions.routes[selectedRouteIndex]],
        };
        
        return (
            <DirectionsRenderer
                directions={selectedDirections}
                options={{
                    polylineOptions: {
                        strokeColor: "#0f53ff",
                        strokeWeight: 5,
                        strokeOpacity: 1.0,
                        geodesic: true,
                    },
                    markerOptions: {
                        visible: false,
                    },
                }}
            />
        );
    };
    
    //Places Pointer
    const handleAddressUpdate = (newCoordinates) => {
        console.log("NEW COORDS::::::::::::::::::::::::::::::::", newCoordinates)
        setStarting(newCoordinates);
    };
    
    useEffect(() => {
        let isCancelled = false;
        const placeData = getPlaceData(selectedDate);
        //console.log("PlaceData: ", placeData);

        const adaptCoordinates = (coordinates) => ({
            lat: coordinates.lat || coordinates.latitude,
            lng: coordinates.lng || coordinates.longitude
        });

        const geocodePlaces = async () => {
            const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
            const newMarkers = [];
            //console.log("ALLPLACESBYDATE", allPlacesByDate[selectedDate])
            for (const place of allPlacesByDate[selectedDate] || []) {
                // If coordinates are already available, use them
                if (place.details.coordinates) {
                    newMarkers.push(adaptCoordinates(place.details.coordinates));
                } else {
                    // Fetch new coordinates if they are not available
                    try {
                        const results = await getGeocode({ address: place.details.address });
                        const { lat, lng } = await getLatLng(results[0]);
                        if (!isCancelled) {
                            // Update place with new coordinates
                            place.details.coordinates = { lat, lng };
                            newMarkers.push({ lat, lng });
                        }
                    } catch (error) {
                        //console.error('Error geocoding:', error);
                    }
                }
            }

            if (!isCancelled) {
                setMarkers(newMarkers);
                // Save updated places back to localStorage
                localStorage.setItem('addedPlacesByDate', JSON.stringify(allPlacesByDate));
                if (newMarkers.length > 0) {
                    const center = calculateCenterFromMarkers(newMarkers);
                    setMapCenter(center);
                    if (mapRef.current) {
                        mapRef.current.panTo(center);
                    }
                }
                setDirections({ routes: [] });
                setStarting(null);
                setDestination(null);
            }
        };
    
        geocodePlaces();
    
        return () => {
            isCancelled = true;
        };
    }, [addresses, selectedDate]);

    //Centering
    const calculateCenterFromMarkers = (markers) => {
        const validMarkers = markers.filter(marker => {
            return marker.lat !== null && marker.lng !== null && typeof marker.lat === 'number' && typeof marker.lng === 'number';
        });
    
        if (validMarkers.length === 0) return { lat: 43, lng: -80 }; // Default center if no valid markers
    
        const sum = validMarkers.reduce((acc, marker) => {
            acc.lat += marker.lat;
            acc.lng += marker.lng;
            return acc;
        }, { lat: 0, lng: 0 });
    
        return {
            lat: sum.lat / validMarkers.length,
            lng: sum.lng / validMarkers.length,
        };
    };
    
    
    

    useEffect(() => {
        const housingWithAddress = housing?.filter(house => house.address && typeof house.lat === 'number' && typeof house.lng === 'number') || [];
        const centerHousing = housingWithAddress.length > 0 ? calculateCenterFromMarkers(housingWithAddress) : null;
        const centerMarkers = markers.length > 0 ? calculateCenterFromMarkers(markers) : null;
    
        if (centerHousing) {
            setMapCenter(centerHousing);
            if (mapRef.current) {
                mapRef.current.panTo(centerHousing);
            }
        } else if (centerMarkers) {
            setMapCenter(centerMarkers);
            if (mapRef.current) {
                mapRef.current.panTo(centerMarkers);
            }
        } else {
            setMapCenter(center);
            if (mapRef.current) {
                mapRef.current.panTo(center);
            }
        }
    }, [housing, markers]);
    
    
    
    
    return <div className="relative xl:flex xl:flex-row xl:h-[70vh] h-[90vh] rounded">
        <div className="xl:flex xl:flex-col absolute inset-0 xl:relative xl:w-[20%] w-full bg-opacity-90 xl:bg-gray-200 rounded-none xl:rounded-bl-md xl:border-white border-r-0 xl:border-r-2 z-10 p-3 xl:p-0">
            <div className="xl:flex-col flex-row flex">
                <div className="m-3">
                    <TravelModeSelector onModeChange={(mode) => setTravelMode(mode)} />
                </div>
                <div className="mx-3 my-2 w-[250px] xl:w-auto">
                    <Places 
                        setStarting={setStarting}
                        housing={housing}
                        selectedDate={selectedDate}
                        updateTrigger={updateTrigger}
                        className="bg-gray-100 rounded-md border border-gray-300"
                    /> 
                </div>
                <div className="mx-3 my-2 w-[250px] xl:w-auto">
                    <DestinationSelect 
                        setDestination={setDestination}
                        housing={housing}
                        selectedDate={selectedDate}
                        updateTrigger={updateTrigger}
                        className="bg-gray-100 rounded-md border border-gray-300"
                    /> 
                </div>
            </div>
            
            <div className="overflow-y-auto xl:max-h-[450px] h-auto">
                {directions && directions.routes && (
                    <Distance 
                        directions={directions} 
                        travelMode={travelMode} 
                        setSelectedRouteIndex={setSelectedRouteIndex}
                        selectedRouteIndex={selectedRouteIndex}
                    />
                )}
            </div>
        </div>

        <div className="xl:w-[80%] w-full xl:h-[70vh] h-[90vh] "> 
            <GoogleMap 
                zoom={12} 
                center={mapCenter} 
                mapContainerClassName="w-full xl:h-[70vh] h-[90vh] xl:rounded-r-md xl:rounded-bl-none rounded-tr-md rounded-b-md xl:mb-0 mb-4" 
                options={options}
                onLoad={onLoad}
            >
            {renderSelectedRoute()}
            {housing && housing.length > 0 && housing.map((house, index) => (
                <Marker 
                    key={index} 
                    position={{ lat: house.lat, lng: house.lng }}
                    icon='images/home.png' // Ensure this path is correct
                />
            ))}

            {markers.length > 0 && (
                markers.map((coord, index) => (
                    <Marker 
                        key={index} 
                        position={coord} 
                        
                        icon={createMarkerIcon(index + 1)}
                    />
                ))
            )}
            </GoogleMap>
        </div>
    </div>;
}
