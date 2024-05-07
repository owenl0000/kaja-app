import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faWalking, faBicycle, faBus, faChevronRight, faGripLinesVertical } from '@fortawesome/free-solid-svg-icons';

export default function Distance({ directions, travelMode, setSelectedRouteIndex, selectedRouteIndex }) {
    const [showDetails, setShowDetails] = useState(Array(directions.routes.length).fill(false));
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    //console.log(travelMode);
    const toggleDetails = (index) => {
        const updatedShowDetails = [...showDetails];
        updatedShowDetails[index] = !updatedShowDetails[index];
        setShowDetails(updatedShowDetails);
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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

    const adjustButtonTranslation = () => {
        const sidebarButton = document.querySelector('.sidebar-toggle-button'); // Ensure this class is added to your button
        if (!sidebarButton) return;
      
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        
        // Define your breakpoints and rem values
        const startPx = 768;
        const endPx = 1024;
        const startRem = 17;
        const endRem = 22;
        
        // Convert REM to pixels assuming the base size is 16px
        const baseSize = 16; // Adjust if your base font size is different
        
        // Calculate the translation value
        if (vw >= startPx && vw <= endPx) {
          const progress = (vw - startPx) / (endPx - startPx);
          const remValue = startRem + (endRem - startRem) * progress;
          const translateValue = remValue * baseSize;
          sidebarButton.style.transform = `translateX(${translateValue}px)`;
        } else if (vw < startPx) {
          sidebarButton.style.transform = `translateX(${startRem * baseSize}px)`;
        } else {
          sidebarButton.style.transform = `translateX(${endRem * baseSize}px)`;
        }
      };
      
      // Initial adjust and event listener for resizing
      window.addEventListener('load', adjustButtonTranslation);
      window.addEventListener('resize', adjustButtonTranslation);
      
    return (
        <>
            <div className='relative flex-row flex overflow-y-auto '>
                <button
                    onClick={toggleSidebar}
                    
                    className={` ${isSidebarOpen ? "sidebar-toggle-button" : "translate-x-0"} text-coral xl:hidden font-bold rounded-md place-self-center drop-shadow-md -translate-y-1/2 absolute transform transition-transform ease-in-out`}>
                    {isSidebarOpen ? (
                            <FontAwesomeIcon icon={faGripLinesVertical} size='3x'/>
                        ) : (
                            <FontAwesomeIcon icon={faChevronRight} size='3x'/>
                    )}
                                            
                </button>
                <div className={`w-[35%] xl:w-full lg:static top-0 left-0 overflow-auto rounded-md xl:bg-transparent transform transition-transform ease-in-out ${isSidebarOpen ? "translate-x-0 bg-white border-2 shadow-md" : "-translate-x-full bg-transparent"} xl:translate-x-0`}>
                    {directions.routes.map((route, index) => (
                        <div 
                            key={index} 
                            className={`grid grid-cols-12 gap-2 p-3 bg-white mx-2 mt-5 shadow-lg rounded-lg mb-4 cursor-pointer ${index === selectedRouteIndex ? 'border-2 border-coral' : 'border border-gray-300'}`}
                            onClick={() => handleRouteSelection(index)}
                        >
                            <div className="col-span-1 flex items-start justify-center">
                                <FontAwesomeIcon icon={getTravelModeIcon()} className="text-coral mt-[2px]" />
                            </div>
                            <div className="col-span-8">
                                <p className="font-semibold text-sm whitespace-normal truncate">
                                {route.summary || (() => {
                                    const firstTransitStep = route.legs[0].steps.find(step => step.transit);
                                    return firstTransitStep 
                                        ? `Depart at ${firstTransitStep.transit.departure_time.text} on ${firstTransitStep.transit.line.name}` 
                                        : 'Transit Route';
                                })()}
                                </p>
                                
                                <div onClick={() => toggleDetails(index)} className="cursor-pointer mt-2">
                                    <span className="text-blue-500 font-semibold">{showDetails[index] ? 'Hide Details' : 'Show Details'}</span>
                                </div>
                                {showDetails[index] && (
                                    <div className="text-sm mt-2">
                                        {route.legs[0].steps.map((step, stepIndex) => (
                                            <div key={stepIndex}>
                                                <p>{step.instructions}</p>

                                                {step.transit && (
                                                    <div className="mt-1 ml-2">
                                                        <p>Departure Stop: {step.transit.departure_stop.name}</p>
                                                        <p>Arrival Stop: {step.transit.arrival_stop.name}</p>
                                                        <p>Line: {step.transit.line.name}</p>
                                                        {/* Display departure time, if available */}
                                                        {step.transit.departure_time && (
                                                        <p>Departure Time: {step.transit.departure_time.text}</p>
                                                        )}
                                                        {/* Display arrival time, if available */}
                                                        {step.transit.arrival_time && (
                                                        <p>Arrival Time: {step.transit.arrival_time.text}</p>
                                                        )}
                                                        <p>Number of Stops: {step.transit.num_stops}</p>
                                                        
                                                    </div>
                                                )}
                                            </div>
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
            </div>
        </>
    );
}