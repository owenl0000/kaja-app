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

export default function Map({ addresses, selectedDate, housingData, updateTrigger }) {
    const [markers, setMarkers] = useState([]);
    const [housing, setHousing] = useState();
    const [directions, setDirections] = useState({ routes: [] });
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
    const [destination, setDestination] = useState();
    const [starting, setStarting] = useState();
    const [travelMode, setTravelMode] = useState(google.maps.TravelMode.DRIVING);
    const mapRef = useRef();
    const lastUpdatedAddressRef = useRef(null);
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
    //console.log("Markers ", markers);
    //console.log("Housing", housing)
    const onLoad = useCallback(map => (mapRef.current = map), []);

    
    //Housing Pointer
    useEffect(() => {
        const initializeHousingData = async () => {
            console.log("UpdateTrigger or selectedDate change detected");
            const housingData = JSON.parse(localStorage.getItem('housingData')) || {};
            const housingForDate = housingData[selectedDate] || [];
            const hasValidAddress = housingForDate.some(h => h.address && h.address.trim() !== '');

            if (hasValidAddress) {
                const firstValidAddress = housingForDate.find(h => h.address && h.address.trim() !== '').address;

                if (firstValidAddress && lastUpdatedAddressRef.current !== firstValidAddress) {
                    console.log("Valid address detected, updating coordinates");
                    await updateHousingCoordinates(firstValidAddress, selectedDate);
                    lastUpdatedAddressRef.current = firstValidAddress;

                    // Use the updated housingData
                    const updatedHousingData = JSON.parse(localStorage.getItem('housingData'));
                    const updatedHousing = updatedHousingData[selectedDate]?.find(h => h.address === firstValidAddress);

                    if (updatedHousing) {
                        setHousing({ lat: updatedHousing.lat, lng: updatedHousing.lng });
                    }
                }
            } else {
                console.log("No valid addresses for selected date, clearing coordinates in housingData");
                // Clear out the coordinates for this date in housingData
                const cleanedData = housingForDate.map(data => {
                    if (data.lat != null || data.lng != null) {
                        return { ...data, lat: null, lng: null };
                    }
                    return data;
                });
                housingData[selectedDate] = cleanedData;
                localStorage.setItem('housingData', JSON.stringify(housingData));
                setHousing(null);
                lastUpdatedAddressRef.current = null;
            }
        };
    
        initializeHousingData();
    }, [updateTrigger, selectedDate]);

    //Directions
    const fetchDirections = async () => {
        if (!starting || !destination || !travelMode) {
            console.log("Required data not available for fetching directions");
            return; // Exit if data is not available
        }

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
        fetchDirections();
    }, [starting, destination, travelMode]);

    const renderSelectedRoute = () => {
        if (!directions || !directions.routes || directions.routes.length === 0 || selectedRouteIndex >= directions.routes.length) {
            return null; 
        }


        const selectedDirections = {
            ...directions,
            routes: [directions.routes[selectedRouteIndex]],
        };
        console.log(selectedDirections);
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
        setStarting(newCoordinates);
    };
    
    useEffect(() => {
        let isCancelled = false;
        const placeData = getPlaceData(selectedDate);
        console.log("PlaceData: ", placeData);

        const adaptCoordinates = (coordinates) => ({
            lat: coordinates.lat || coordinates.latitude,
            lng: coordinates.lng || coordinates.longitude
        });

        const geocodePlaces = async () => {
            const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
            const newMarkers = [];

            for (const place of allPlacesByDate[selectedDate] || []) {
                // If coordinates are already available, use them
                if (place.coordinates) {
                    newMarkers.push(adaptCoordinates(place.coordinates));
                } else {
                    // Fetch new coordinates if they are not available
                    try {
                        const results = await getGeocode({ address: place.address });
                        const { lat, lng } = await getLatLng(results[0]);
                        if (!isCancelled) {
                            // Update place with new coordinates
                            place.coordinates = { lat, lng };
                            newMarkers.push({ lat, lng });
                        }
                    } catch (error) {
                        console.error('Error geocoding:', error);
                    }
                }
            }

            if (!isCancelled) {
                setMarkers(newMarkers);
                // Save updated places back to localStorage
                localStorage.setItem('addedPlacesByDate', JSON.stringify(allPlacesByDate));
            }
        };
    
        geocodePlaces();
    
        return () => {
            isCancelled = true;
        };
    }, [addresses, selectedDate]);

    //Centering
    const calculateCenterFromMarkers = (markers) => {
        if (markers.length === 0) return { lat: 43, lng: -80 }; // Default center if no markers
    
        const sum = markers.reduce((acc, marker) => {
            acc.lat += marker.lat;
            acc.lng += marker.lng;
            return acc;
        }, { lat: 0, lng: 0 });
    
        return {
            lat: sum.lat / markers.length,
            lng: sum.lng / markers.length,
        };
    };

    useEffect(() => {
        // If there's housing, center on it. Otherwise, center on the places.
        if (housing) {
            setMapCenter({ lat: housing.lat, lng: housing.lng });
        } else if (markers.length > 0) {
            setMapCenter(calculateCenterFromMarkers(markers));
        } else {
            setMapCenter(center); // Fallback to default center
        }
    }, [housing, markers]);
    
    
    return <div className="relative xl:flex xl:flex-row xl:h-[70vh] h-[90vh] rounded">
        <div className="absolute inset-0 xl:relative xl:w-[20%] w-full bg-opacity-90 xl:bg-gray-200 rounded-none xl:rounded-bl-md xl:border-white border-r-0 xl:border-r-2 z-10 p-3 xl:p-0">
            <div className="xl:flex-col flex-row flex xl:block">
                <div className="m-3">
                    <TravelModeSelector onModeChange={(mode) => setTravelMode(mode)} />
                </div>
                <div className="mx-3 my-2 w-[250px] xl:w-auto">
                    <Places 
                        setStarting={setStarting}
                        onAddressUpdate={handleAddressUpdate}
                        selectedDate={selectedDate}
                        className="bg-gray-100 rounded-md border border-gray-300"
                    /> 
                </div>
                <div className=" mx-3 my-2 w-[250px] xl:w-auto">
                    <DestinationSelect 
                        setDestination={setDestination}
                        selectedDate={selectedDate}
                        className="bg-gray-100 rounded-md border border-gray-300"
                    /> 
                </div>
            </div>
            <div className="overflow-auto routes-container xl:max-h-[450px]">
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
            {housing && (
                <>
                    <Marker position={housing} icon='images/home.png'/>
                </>
            )}

            {markers.length > 0 && (
                <MarkerClusterer >
                    {(clusterer) =>
                        markers.map((coord, index) => (
                            <Marker 
                                key={index} 
                                position={coord} 
                                clusterer={clusterer} 
                                icon={createMarkerIcon(index + 1)}
                            />
                        ))
                    }
                </MarkerClusterer>
            )}
            </GoogleMap>
        </div>
    </div>;
}
