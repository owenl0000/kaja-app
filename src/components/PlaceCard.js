// components/PlaceCard.js
import React from 'react';
import Image from 'next/image';
import TimePicker from './TimePicker';

function PlaceCard({ 
    uniqueKey,
    place, 
    index, 
    budget, 
    handleBudgetChange, 
    userNotes, 
    handleNoteChange, 
    timeFrame,
    handleTimeFrameChange, 
    onRemoveButtonClick
}) {
    const currentBudget = budget[uniqueKey] || '';
    const currentNote = userNotes[uniqueKey] || '';

    const handleBudgetInputChange = (e) => {
        const value = e.target.value;
        // Allow only numbers and one decimal point
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            handleBudgetChange(uniqueKey, value);
        }
    };

    return (
        <div className="flex flex-row items-start mb-6 bg-gray-200 p-4 rounded-lg">
            {/* Image */}
            <div className="w-[200px] h-[200px] flex-shrink-0 mb-4 md:mb-0 rounded overflow-hidden">
                <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
            </div>

            <div className="ml-6 flex flex-row w-full h-[200px]">
                {/* Details */}
                <div className="flex flex-col">
                    <div className="text-lg font-semibold min-w-[100px]">{place.name}</div>
                    <div className="text-sm min-w-[200px]">{place.address || 'N/A'}</div>
                    <div className="text-sm min-w-[200px]">{place.contact || 'N/A'}</div>
                    <div className="my-1">
                        <a href={place.yelpLink} target="_blank" rel="noopener noreferrer" className="inline-block">
                            <Image src="/images/yelp_logo.png" alt="Yelp" width={40} height={10}/>
                        </a>
                    </div>
                </div>
                {/* Time Frame, Notes, and Budget */}
                <div className="ml-6 flex flex-col w-full h-full">
                    <div className="flex align-items-center relative font-bold">
                        <TimePicker 
                            timeFrame={timeFrame || "12:00 AM to 1:00 PM"} 
                            onChange={(newTimeFrame) => handleTimeFrameChange(uniqueKey, newTimeFrame)}
                            uniqueKey={uniqueKey}
                        />
                        <div className="ml-4 budget-input-wrapper">
                            <span className="currency-symbol ml-1">$</span>
                            <input
                                type="text"
                                placeholder="Enter Budget"
                                value={currentBudget}
                                onChange={handleBudgetInputChange}
                                className="budget-input"
                            />
                        </div>
                        <button 
                            className="absolute top-0 right-0"
                            onClick={() => onRemoveButtonClick(index)}
                        >
                            <i className="fa fa-trash fa-lg text-red-500"></i>
                        </button>
                    </div>
                    <textarea
                        placeholder="Enter Notes"
                        value={currentNote}
                        onChange={(e) => handleNoteChange(uniqueKey, e.target.value)}
                        className="notes-input mt-2 p-1 border rounded w-full h-full resize-none"
                    />
                </div>
            </div>
        </div>
    );
}

export default PlaceCard;
