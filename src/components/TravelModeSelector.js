import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faWalking, faBicycle, faBus } from '@fortawesome/free-solid-svg-icons';

export default function TravelModeSelector({ onModeChange }) {
    const [selectedMode, setSelectedMode] = useState('DRIVING');
    const [showDropdown, setShowDropdown] = useState(false);

    const travelModes = [
        { label: 'Drive', value: 'DRIVING', icon: faCar },
        { label: 'Walk', value: 'WALKING', icon: faWalking },
        { label: 'Bike', value: 'BICYCLING', icon: faBicycle },
        { label: 'Public Transport', value: 'TRANSIT', icon: faBus }
    ];

    const handleModeChange = (mode) => {
        setSelectedMode(mode.value);
        onModeChange(mode.value);
        setShowDropdown(false); 
    };

    return (
      <div className="relative inline-block xl:w-full">
        {/* xl version*/}
        <div className="hidden xl:flex justify-around p-1 w-full">
            {travelModes.map(mode => (
                <button 
                    key={mode.value} 
                    onClick={() => handleModeChange(mode)}
                    className={`text-xl p-2 rounded-full ${selectedMode === mode.value ? 'bg-[#FF6B6B]/20 text-[#FF6B6B]' : 'text-gray-400'} hover:bg-[#FF6B6B]/20 hover:text-[#FF6B6B]`}
                    style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.3s' }}
                >
                    <FontAwesomeIcon icon={mode.icon} fixedWidth />
                </button>
            ))}
        </div>
        
        {/* below xl */}
        <div className="xl:hidden bg-white rounded-full">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 rounded-full bg-[#FF6B6B]/20"
                style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <FontAwesomeIcon icon={travelModes.find(mode => mode.value === selectedMode).icon} className={`text-xl ${selectedMode ? 'text-[#FF6B6B]' : 'text-gray-400'}`} />
            </button>
            {showDropdown && (
                <div className="absolute z-10 flex flex-col items-center bg-white border border-gray-200 rounded-b-full shadow-lg" style={{ marginTop: '8px', left: '50%', transform: 'translateX(-50%)' }}>
                    {travelModes.filter(mode => mode.value !== selectedMode).map((mode) => (
                        <button
                            key={mode.value}
                            onClick={() => handleModeChange(mode)}
                            className="p-2 hover:bg-[#FF6B6B]/20"
                            style={{ width: '40px', height: '40px' }}
                        >
                            <FontAwesomeIcon icon={mode.icon} className="text-xl text-gray-400" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    </div>
    );
}
