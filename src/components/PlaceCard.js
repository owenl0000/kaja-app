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
        <div className="grid sm:grid-cols-1 lg:grid-cols-5 mb-6 bg-gray-200 p-4 rounded-lg relative">

            <button
                className="absolute top-0 right-0 lg:hidden sm:flex m-4"
                onClick={() => onRemoveButtonClick(index)}
            >
                <i className="fa fa-trash fa-lg text-red-500 "></i>
            </button>


            {/* Image */}
            <div className="w-full sm:flex sm:justify-center">
                <img src={place.image} alt={place.name} className="rounded-lg lg:w-[200px] lg:h-[200px] sm:w-[300px] sm:h-[300px] object-cover" />
            </div>


            {/* Details */}
            <div className="flex flex-col lg:text-start sm:text-center p-2">
                <div className="text-lg font-semibold min-w-[100px]">{place.name}</div>
                <div className="text-sm min-w-[200px]">{place.address || 'N/A'}</div>
                <div className="text-sm min-w-[200px]">{place.contact || 'N/A'}</div>
                <div className="text-sm min-w-[200px]"> Price: {place.price || 'N/A'}</div>
                <div className="my-1">
                    <a href={place.yelpLink} target="_blank" rel="noopener noreferrer" className="inline-block">
                        <Image src="/images/yelp_logo.png" alt="Yelp" width={40} height={10}/>
                    </a>
                </div>
            </div>

            {/* Time Frame, Notes, and Budget */}
            <div className="grid grid-cols-2 gap-3 w-full h-full sm:col-span-1 lg:col-span-3 relative">
                <TimePicker
                    timeFrame={timeFrame || "12:00 AM to 1:00 PM"}
                    onChange={(newTimeFrame) => handleTimeFrameChange(uniqueKey, newTimeFrame)}
                    uniqueKey={uniqueKey}
                />

                <div className="budget-input-wrapper">
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
                    className="absolute top-0 right-0 sm:hidden lg:flex m-4"
                    onClick={() => onRemoveButtonClick(index)}
                >
                    <i className="fa fa-trash fa-lg text-red-500 "></i>
                </button>

                <textarea
                    placeholder="Enter Notes"
                    value={currentNote}
                    onChange={(e) => handleNoteChange(uniqueKey, e.target.value)}
                    className="notes-input p-2 border rounded w-full h-full resize-none col-span-2"
                />
            </div>

        </div>
    );
}

export default PlaceCard;
