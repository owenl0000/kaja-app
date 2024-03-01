import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faWalking, faBicycle, faBus, faRoad } from '@fortawesome/free-solid-svg-icons';

export default function Distance({ directions, travelMode, setSelectedRouteIndex, selectedRouteIndex }) {
    const [showDetails, setShowDetails] = useState(Array(directions.routes.length).fill(false));
    //console.log(travelMode);
    //console.log("Directions ", directions);
    const toggleDetails = (index) => {
        const updatedShowDetails = [...showDetails];
        updatedShowDetails[index] = !updatedShowDetails[index];
        setShowDetails(updatedShowDetails);
    };

    const getTravelModeIcon = () => {
        switch (travelMode) {
            case 'DRIVING': return faCar;
            case 'WALKING': return faWalking;
            case 'BICYCLING': return faBicycle;
            case 'TRANSIT': return faBus;
            default: return faCar;
        }
    };

    const handleRouteSelection = (index) => {
        setSelectedRouteIndex(index); 
    };

    if (!directions || !directions.routes || directions.routes.length === 0) return null;

    return (
        <div>
            {directions.routes.map((route, index) => (
                <div 
                    key={index} 
                    className={`grid grid-cols-12 gap-2 p-3 bg-white mx-2 mt-5 shadow rounded-lg mb-4 cursor-pointer ${index === selectedRouteIndex ? 'border-2 border-coral' : ''}`}
                    onClick={() => handleRouteSelection(index)}
                >
                    <div className="col-span-1 flex items-start justify-center">
                        <FontAwesomeIcon icon={getTravelModeIcon()} className="text-coral mt-[2px]" />
                    </div>
                    <div className="col-span-8">
                        <p className="font-semibold text-sm whitespace-normal">
                            {route.summary || `Route ${index + 1}`}
                        </p>
                        <div onClick={() => toggleDetails(index)} className="cursor-pointer mt-2">
                            <span className="text-blue-500 font-semibold">{showDetails[index] ? 'Hide Details' : 'Show Details'}</span>
                        </div>
                        {showDetails[index] && (
                            <div className="text-sm mt-2">
                                {route.legs[0].steps.map((step, stepIndex) => (
                                    <p key={stepIndex}>{step.instructions}</p>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="col-span-3 text-right">
                        <span className="font-semibold text-sm block">{route.legs[0].duration.text}</span>
                        <span className="text-sm font-normal">{route.legs[0].distance.text}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}