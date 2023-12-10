// components/PlanCreator.js
import React, { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import PlaceCard from './PlaceCard';
import BudgetCalculator from './BudgetCalculator';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function PlanCreator({ selectedDate, addedPlacesByDate}) {

  const [placesForSelectedDate, setPlacesForSelectedDate] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [indexToRemove, setIndexToRemove] = useState(null);
  const [userNotes, setUserNotes] = useState({});
  const [timeFrame, setTimeFrame] = useState({});
  const [budget, setBudget] = useState({});

  const generateUniqueId = () => {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  useEffect(() => {
    const initialBudget = JSON.parse(localStorage.getItem('budget')) || {};
    const initialUserNotes = JSON.parse(localStorage.getItem('userNotes')) || {};
    const initialTimeFrame = JSON.parse(localStorage.getItem('timeFrame')) || {};

    setBudget(initialBudget);
    setUserNotes(initialUserNotes);
    setTimeFrame(initialTimeFrame);
  }, []);
  
  useEffect(() => {
    const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
    let updatedPlaces = allPlacesByDate[selectedDate] || [];
    let isUpdated = false;
    updatedPlaces = updatedPlaces.map(place => {
      if (!place.uniqueId) {
        isUpdated = true;
        const newUniqueId = generateUniqueId();
        place.uniqueId = newUniqueId;
      }
      return place;
    });
  
    if (isUpdated) {
      allPlacesByDate[selectedDate] = updatedPlaces;
      localStorage.setItem('addedPlacesByDate', JSON.stringify(allPlacesByDate));
    }
  
    setPlacesForSelectedDate(updatedPlaces);
  }, [selectedDate, addedPlacesByDate]);
  
  

  const removePlace = () => {
    if (indexToRemove === null) return;

    const placeToRemove = placesForSelectedDate[indexToRemove];
    const uniqueIdToRemove = placeToRemove.uniqueId;

    // Filter out the removed place from placesForSelectedDate
    const updatedPlaces = placesForSelectedDate.filter((_, idx) => idx !== indexToRemove);

    // Update the localStorage for places
    const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
    allPlacesByDate[selectedDate] = updatedPlaces;
    localStorage.setItem('addedPlacesByDate', JSON.stringify(allPlacesByDate));

    // Remove the corresponding budget entry
    const updatedBudget = { ...budget };
    delete updatedBudget[uniqueIdToRemove];

    // Remove the budget entry for the removed place from budgetData
    const storedBudgetData = JSON.parse(localStorage.getItem('budgetData')) || {};
    if (storedBudgetData[selectedDate]) {
        delete storedBudgetData[selectedDate][uniqueIdToRemove];
        if (Object.keys(storedBudgetData[selectedDate]).length === 0) {
            delete storedBudgetData[selectedDate];
        }
    }

    // Update the state and localStorage for budget and notes
    setBudget(updatedBudget);
    localStorage.setItem('budget', JSON.stringify(updatedBudget));
    localStorage.setItem('budgetData', JSON.stringify(storedBudgetData));

    // Update remaining state items
    const updatedUserNotes = { ...userNotes };
    const updatedTimeFrame = { ...timeFrame };
    delete updatedUserNotes[uniqueIdToRemove];
    delete updatedTimeFrame[uniqueIdToRemove];
    setUserNotes(updatedUserNotes);
    localStorage.setItem('userNotes', JSON.stringify(updatedUserNotes));
    localStorage.setItem('timeFrame', JSON.stringify(updatedTimeFrame));

    // Update the state for places and close the modal
    setPlacesForSelectedDate(updatedPlaces);
    setShowConfirmModal(false);
    setIndexToRemove(null);
};

  
  const handleBudgetChange = (uniqueId, amount) => {
    // Update the budget state for this uniqueId
    const newBudget = { ...budget, [uniqueId]: amount };
    setBudget(newBudget);
    localStorage.setItem('budget', JSON.stringify(newBudget));
    
  
    // Update the budget data for local storage
    const storedBudgetData = JSON.parse(localStorage.getItem('budgetData')) || {};
    const budgetForSelectedDate = storedBudgetData[selectedDate] || {};
    const updatedBudgetForSelectedDate = { ...budgetForSelectedDate, [uniqueId]: amount };
  
    // Save the updated budget data to local storage
    const newBudgetData = { ...storedBudgetData, [selectedDate]: updatedBudgetForSelectedDate };
    localStorage.setItem('budgetData', JSON.stringify(newBudgetData));
  };
  


  const handleNoteChange = (id, note) => {
    const newUserNotes = { ...userNotes, [id]: note };
    setUserNotes(newUserNotes);
    localStorage.setItem('userNotes', JSON.stringify(newUserNotes)); 
  };

  const handleTimeFrameChange = (uniqueId, frame) => {
    const newTimeFrame = { ...timeFrame, [uniqueId]: frame };
    setTimeFrame(newTimeFrame);
    localStorage.setItem('timeFrame', JSON.stringify(newTimeFrame));
  };
  

  const onRemoveButtonClick = (index) => {
    setIndexToRemove(index);
    setShowConfirmModal(true);
  };
  
  const totalPlaceholders = placesForSelectedDate.length < 5 ? 5 - placesForSelectedDate.length : 0;

  const onDragEnd = (result) => {
    // Do nothing if dropped outside the list
    if (!result.destination) return;
  
    // Reordering logic
    const reorderedPlaces = Array.from(placesForSelectedDate);
    const [reorderedItem] = reorderedPlaces.splice(result.source.index, 1);
    reorderedPlaces.splice(result.destination.index, 0, reorderedItem);
  
    // Update state
    setPlacesForSelectedDate(reorderedPlaces);
  
    // Update localStorage
    const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
    allPlacesByDate[selectedDate] = reorderedPlaces;
    localStorage.setItem('addedPlacesByDate', JSON.stringify(allPlacesByDate));
  };
  
  return (
    <div className="flex flex-col items-start bg-gray-100 ">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="placesDroppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex w-full">
              <div className="flex flex-col w-3/4 bg-white rounded-lg shadow-lg mt-10 ml-10 mb-10 p-4 ">
                {placesForSelectedDate.map((place, index) => (
                  <Draggable key={`draggable-${index}`} draggableId={`draggable-${index}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          // Preserve the original layout space of the item being dragged
                          marginBottom: snapshot.isDragging ? "1.5rem" : "0",
                        }}
                      >
                        <PlaceCard
                          key={place.uniqueId}
                          uniqueKey={place.uniqueId}
                          index={index}
                          place={place}
                          budget={budget}
                          handleBudgetChange={handleBudgetChange}
                          userNotes={userNotes}
                          handleNoteChange={handleNoteChange}
                          timeFrame={timeFrame[place.uniqueId] || "12:00 AM to 1:00 PM"}
                          handleTimeFrameChange={handleTimeFrameChange}
                          onRemoveButtonClick={onRemoveButtonClick}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {showConfirmModal && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg">
                      <p>Are you sure you want to remove this place?</p>
                      <div className="flex justify-end mt-2">
                        <button 
                          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                          onClick={removePlace}
                        >
                          Yes
                        </button>
                        <button 
                          className="bg-gray-300 text-black px-4 py-2 rounded"
                          onClick={() => setShowConfirmModal(false)}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {[...Array(totalPlaceholders)].map((_, index) => (
                  <div key={`placeholder-${index}`} className="flex items-start mb-6 bg-gray-200 p-4 rounded-lg">
                    <div className="w-48 h-32 bg-gray-300 rounded"></div>
                    <div className="ml-6">
                      <div className="bg-gray-300 w-32 h-6 mb-2 rounded"></div>
                      <div className="bg-gray-300 w-48 h-4 mb-2 rounded"></div>
                      <div className="bg-gray-300 w-36 h-4 mb-2 rounded"></div>
                      <div className="bg-gray-300 w-24 h-4 mb-2 rounded"></div>
                      <div className="bg-gray-300 w-24 h-4 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex-1 ml-4 mt-10 mr-4">
                <BudgetCalculator 
                  selectedDate={selectedDate} 
                  handleBudgetChange={handleBudgetChange}
                />
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );      
}

export default PlanCreator;
