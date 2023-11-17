// components/PlaceCard.js
import React from 'react';
import Image from 'next/image';
import TimePicker from './TimePicker';

function PlaceCard({ 
    place, 
    index, 
    budget, 
    handleBudgetChange, 
    userNotes, 
    handleNoteChange, 
    handleTimeFrameChange, 
    onRemoveButtonClick
}) {

    return (
        <div className="flex items-start mb-6 bg-gray-200 p-4 rounded-lg">
            {/* Image */}
            <img src={place.image} alt={place.name} className="w-[200px] h-[200px] rounded flex-shrink-0" />
            {/* Details */}
            <div className="ml-6 flex flex-row w-full h-[200px]">
                <div className="flex flex-col">
                    <div className="text-lg font-semibold min-w-[100px]">{place.name}</div>
                    <div className="text-sm min-w-[200px]">{place.address || 'N/A'}</div>
                    <div className="text-sm min-w-[200px]">{place.contact || 'N/A'}</div>
                    <a href={place.yelpLink} target="_blank" rel="noopener noreferrer" className='my-1'>
                        <Image src="/images/yelp_logo.png" alt="Yelp" width={40} height={10}/>
                    </a>
                </div>
                {/* Time Frame, Notes, and Budget */}
                <div className="ml-6 flex flex-col w-full h-full">
                    <div className="flex flex-row align-items-center relative">
                        <TimePicker onChange={(time) => handleTimeFrameChange(place.id, time)} />
                        <input
                            type="text"
                            placeholder="Enter Budget"
                            value={budget[place.id] || ''}
                            onChange={(e) => handleBudgetChange(place.id, e.target.value)}
                            className="p-1 border rounded ml-2 w-1/3 budget-input"
                        />
                        <button 
                            className="absolute top-0 right-0"
                            onClick={() => onRemoveButtonClick(index)}
                        >
                            <i className="fa fa-trash fa-lg text-red-500"></i>
                        </button>
                    </div>
                    <textarea
                        placeholder="Enter Notes"
                        value={userNotes[place.id] || ''}
                        onChange={(e) => handleNoteChange(place.id, e.target.value)}
                        className="notes-input mt-2 p-1 border rounded w-full h-full resize-none"
                    />
                </div>
            </div>
        </div>
    );
}

export default PlaceCard;
