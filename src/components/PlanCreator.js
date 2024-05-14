// components/PlanCreator.js
import React, { useState, useEffect, useCallback } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import PlaceCard from './PlaceCard';
import BudgetCalculator from './BudgetCalculator';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TransportationSelector from './TransportationSelector';
import HousingSelector from './HousingSelector';
import MapLoader from './MapLoader';
import axios from 'axios';
import { useSession } from 'next-auth/react';


function PlanCreator({ selectedDate, addedPlacesByDate}) {
  //console.log("Places", addedPlacesByDate);
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState([]);
  const [placesForSelectedDate, setPlacesForSelectedDate] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [indexToRemove, setIndexToRemove] = useState(null);
  const [userNotes, setUserNotes] = useState({});
  const [timeFrame, setTimeFrame] = useState({});
  const [budget, setBudget] = useState({});
  console.log("budget",budget);
  const [placesLoaded, setPlacesLoaded] = useState(false);

  const [budgetData, setBudgetData] = useState({});
  const [transportationData, setTransportationData] = useState({});
  const [housingData, setHousingData] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('planner');
  //console.log("Addresses", addresses)
  //console.log("userNotes in plancreator:", userNotes)
  //console.log("housingData", housingData);
  console.log("transportationData", transportationData);

  const generateUniqueId = () => {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  /* useEffect(() => {
    const initialBudget = JSON.parse(localStorage.getItem('budget')) || {};
    const initialUserNotes = JSON.parse(localStorage.getItem('userNotes')) || {};
    const initialTimeFrame = JSON.parse(localStorage.getItem('timeFrame')) || {};
    const savedTransportationData = JSON.parse(localStorage.getItem('transportationData')) || {};
    const savedHousingData = JSON.parse(localStorage.getItem('housingData')) || {};

    setBudget(initialBudget);
    setUserNotes(initialUserNotes);
    setTimeFrame(initialTimeFrame);
    setTransportationData(savedTransportationData);
    setHousingData(savedHousingData);
  }, []); */

  useEffect(() => {
  if (placesForSelectedDate.length && session ) {

    const newBudget = placesForSelectedDate.reduce((acc, place) => {
      if (place.placesData && place.placesData.budget) {
        acc[place.uniqueId] = place.placesData.budget[place.uniqueId];
      }
      return acc;
    }, {});

    const newUserNotes = placesForSelectedDate.reduce((acc, place) => {
      if(place.placesData && place.placesData.userNotes) {
        acc[place.uniqueId] = place.placesData.userNotes[place.uniqueId];
      }
      return acc;
    }, {});

    const newTimeFrame = placesForSelectedDate.reduce((acc, place) => {
      if(place.placesData && place.placesData.timeFrame) {
        acc[place.uniqueId] = place.placesData.timeFrame[place.uniqueId];
      }
      return acc;
    }, {});

    //console.log("newBudget:::::::::::::: ", newBudget)
    //console.log("newUserNotes::::::::::", newUserNotes)
    //console.log("newTimeFrame::::::::::", newTimeFrame)
    setBudget(newBudget);
    setUserNotes(newUserNotes);
    setTimeFrame(newTimeFrame)
    
     // Fetching transportation data
    axios.get(`/api/transportation?date=${selectedDate}`).then(response => {
      setTransportationData(response.data || {});
    }).catch(console.error);
    /*
    // Fetching housing data
    axios.get(`/api/housing`).then(response => {
      setHousingData(response.data || {});
    }).catch(console.error);

    // Fetching budget data
    axios.get(`/api/budget`).then(response => {
      setBudgetData(response.data || {});
    }).catch(console.error); */

  } else {
    // Local storage keys should be predefined or dynamically set as needed
    const localTransportationData = JSON.parse(localStorage.getItem('transportationData') || '{}');
    const localHousingData = JSON.parse(localStorage.getItem('housingData') || '{}');
    const localBudgetData = JSON.parse(localStorage.getItem('budgetData') || '{}');
    const localBudget = JSON.parse(localStorage.getItem('budget')) || {};
    const localUserNotes = JSON.parse(localStorage.getItem('userNotes')) || {};
    const localTimeFrame = JSON.parse(localStorage.getItem('timeFrame')) || {};

    setBudget(localBudget);
    setTransportationData(localTransportationData);
    setHousingData(localHousingData);
    setBudgetData(localBudgetData);
    setUserNotes(localUserNotes);
    setTimeFrame(localTimeFrame);
  }
}, [selectedDate, session, placesForSelectedDate, placesLoaded]);

  
  /* useEffect(() => {
    const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
    let updatedPlaces = allPlacesByDate[selectedDate] || [];
    console.log(updatedPlaces);
    let isUpdated = false;
    updatedPlaces = updatedPlaces.map(place => {
      if (!place.uniqueId) {
        isUpdated = true;
        const newUniqueId = generateUniqueId();
        place.uniqueId = newUniqueId;
      }
      console.log("Place:", place);
      return place;
    });
  
    if (isUpdated) {
      allPlacesByDate[selectedDate] = updatedPlaces;
      localStorage.setItem('addedPlacesByDate', JSON.stringify(allPlacesByDate));
    }
  
    setPlacesForSelectedDate(updatedPlaces);

  }, [selectedDate, addedPlacesByDate]); */

  useEffect(() => {
    let updatedPlaces = addedPlacesByDate[selectedDate] || [];
    console.log("Initial Places:", updatedPlaces);

    // Check if places are loaded from props or need to be fetched from localStorage
    if (!updatedPlaces || updatedPlaces.length === 0) {
        //console.log("Loading places from localStorage");
        const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
        updatedPlaces = allPlacesByDate[selectedDate] || [];
    }

    let isUpdated = false;
    updatedPlaces = updatedPlaces.map(place => {
        //console.log("PlaceUniqueID:", place.uniqueId);
        if (!place.uniqueId) {
            isUpdated = true;
            const newUniqueId = generateUniqueId();
            console.log("Update Unique ID: ", newUniqueId)
            place.uniqueId = newUniqueId;
        }
        return place;
    });

    if (isUpdated) {
      setPlacesLoaded(prev => !prev);
        if (session) {
            //console.log("Storing updated places for session user");
            // You might want to sync these changes back to the server or handle them differently
        } else {
            //console.log("Storing updated places in localStorage for offline user");
            const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
            allPlacesByDate[selectedDate] = updatedPlaces;
            localStorage.setItem('addedPlacesByDate', JSON.stringify(allPlacesByDate));
        }
    }

    setPlacesForSelectedDate(updatedPlaces);
    setPlacesLoaded(true);

}, [selectedDate, addedPlacesByDate, session]);

  
  useEffect(() => {
    let newAddresses = placesForSelectedDate.map(place => {
      console.log("newAddresses::::::", place.details, "::::", !place.details.address, "::::", !place.details.latlng )
      if (place.details && place.details.address && !place.details.latlng) {
        return Array.isArray(place.details.address) ? place.details.address.join(', ') : place.details.address;
      }
      return null;
    }).filter(address => address !== null);
    
    console.log(newAddresses)
    setAddresses(newAddresses);
  
  }, [placesForSelectedDate]);
  

  /* const removePlace = () => {
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
}; */

const removePlace = async () => {
  if (indexToRemove === null) return;

  const placeToRemove = placesForSelectedDate[indexToRemove];
  const uniqueIdToRemove = placeToRemove.uniqueId;
  console.log("PlaceToRemove:", placeToRemove)
  console.log("uniqueID:", uniqueIdToRemove)

  // Filter out the removed place from placesForSelectedDate
  const updatedPlaces = placesForSelectedDate.filter((_, idx) => idx !== indexToRemove);

  if (session) {
    // Send requests to the server to delete the place and related data from the database
    try {
      await Promise.all([
        axios.delete(`/api/plans?uniqueIdDelete=${uniqueIdToRemove}`),
        axios.delete(`/api/budget?uniqueIdDelete=${uniqueIdToRemove}`)
      ]);
      console.log('All related data removed successfully from the database');
    } catch (error) {
      console.error('Failed to remove data from the database', error);
    }
  } else {
    // Update the localStorage for places
    const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
    allPlacesByDate[selectedDate] = updatedPlaces;
    localStorage.setItem('addedPlacesByDate', JSON.stringify(allPlacesByDate));

    // Remove the corresponding budget entry from local storage
    const storedBudgetData = JSON.parse(localStorage.getItem('budgetData')) || {};
    if (storedBudgetData[selectedDate]) {
      delete storedBudgetData[selectedDate][uniqueIdToRemove];
      if (Object.keys(storedBudgetData[selectedDate]).length === 0) {
        delete storedBudgetData[selectedDate];
      }
    }
    localStorage.setItem('budgetData', JSON.stringify(storedBudgetData));

    // Update remaining local storage items
    const updatedBudget = { ...budget };
    delete updatedBudget[uniqueIdToRemove];
    localStorage.setItem('budget', JSON.stringify(updatedBudget));

    const updatedUserNotes = { ...userNotes };
    delete updatedUserNotes[uniqueIdToRemove];
    localStorage.setItem('userNotes', JSON.stringify(updatedUserNotes));

    const updatedTimeFrame = { ...timeFrame };
    delete updatedTimeFrame[uniqueIdToRemove];
    localStorage.setItem('timeFrame', JSON.stringify(updatedTimeFrame));
  }

  // Finally, update the state for places and close the modal
  setPlacesForSelectedDate(updatedPlaces);
  setShowConfirmModal(false);
  setIndexToRemove(null);
};


  
  /* const handleBudgetChange = (uniqueId, amount) => {
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
  }; */

  //console.log("Updated Places:::::::::",placesForSelectedDate)
  const handleBudgetChange = async (uniqueId, amount) => {
    // Update local state for immediate UI response
    const updatedPlaces = placesForSelectedDate.map(place => {
        if (place.uniqueId === uniqueId) {
            const updatedPlaceData = { ...place.placesData, budget: {[uniqueId]: amount} };
            return { ...place, placesData: updatedPlaceData };
        }
        return place;
    });

    // Update the main state to re-render the component
    console.log("updatedPlaces: in handle budget ", updatedPlaces);
    setPlacesForSelectedDate(updatedPlaces);

    // Update the local state for the budget to reflect UI changes immediately
    const newBudget = { ...budget, [uniqueId]: amount };
    console.log("budget:::: ",newBudget)
    setBudget(newBudget);

    // Update budgetData for local storage or session persistence
    const storedBudgetData = JSON.parse(localStorage.getItem('budgetData') || '{}');
    const budgetForSelectedDate = storedBudgetData[selectedDate] || {};
    const updatedBudgetForSelectedDate = { ...budgetForSelectedDate, [uniqueId]: amount };
    const newBudgetData = { ...storedBudgetData, [selectedDate]: updatedBudgetForSelectedDate };

    if (!session) {
        // Handle local storage updates for non-authenticated sessions
        const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
        allPlacesByDate[selectedDate] = updatedPlaces;
        localStorage.setItem('addedPlacesByDate', JSON.stringify(allPlacesByDate));
        localStorage.setItem('budget', JSON.stringify(newBudget));
        localStorage.setItem('budgetData', JSON.stringify(newBudgetData));
    } else {
        // Send update to the server for the placesData within the Plan
        try {
          const placesDataResponse = await axios.post('/api/plans/placesData', {
            planId: uniqueId,  // This should be the plan's ID, ensure this is correctly referenced
            updates: { budget: { [uniqueId]: amount } }
          });
          if(placesDataResponse.status == 200) {
            console.log("Updated budget in placesData:", placesDataResponse.data);
            fetchPlanData(uniqueId);
          }
          
          
          console.log(uniqueId);
          // Optionally update budgetData on the server as well
          const budgetDataResponse = await axios.post('/api/budget', {
              date: selectedDate,
              data: updatedBudgetForSelectedDate,
              uniqueId: uniqueId
          });
          console.log("Updated overall budgetData on server:", budgetDataResponse.data);
      } catch (error) {
          console.error("Error updating budget in placesData:", error.response ? error.response.data : error);
      }
    }
};

const fetchPlanData = async (UniqueId) => {
  try {
      const response = await axios.get(`/api/plans?date=${selectedDate}&uniqueId=${UniqueId}`); // Ensure you use the correct ID to fetch
      if (response.data) {
         // Make sure this is what your component expects
          console.log("placesforselectedDate in fetchPlanData: ",response.data);
      }
  } catch (error) {
      console.error("Failed to fetch updated plan data:", error);
  }
};

  
  
    
  const handleTransportationChange = (selectedDate, entries) => {
    console.log("ENTRIES:", entries);
    if (session) {
      axios.post('/api/transportation', {
        date: selectedDate,
        data: entries
      }).then(response => {
        console.log("Server update successful:", response.data);
      }).catch(error => {
        console.error("Failed to update server:", error);
      });
    } else {
      localStorage.setItem('transportationData', JSON.stringify({
        ...JSON.parse(localStorage.getItem('transportationData') || '{}'),
        [selectedDate]: entries
      }));
    }
  };

  const handleHousingChange = (selectedDate, entries) => {
    console.log("ENTRIES:", entries);
    if (session) {
      axios.post('/api/housing', {
        date: selectedDate,
        data: entries
      }).then(response => {
        console.log("Server update successful:", response.data);
      }).catch(error => {
        console.error("Failed to update server:", error);
      });
    } else {
      localStorage.setItem('housingData', JSON.stringify({
        ...JSON.parse(localStorage.getItem('housingData') || '{}'),
        [selectedDate]: entries
      }));
    }
  };

  

  /* const handleTransportationChange = (date, entries) => {
    const newTransportationData = { ...transportationData, [date]: entries };
    setTransportationData(newTransportationData);
    localStorage.setItem('transportationData', JSON.stringify(newTransportationData));
  }; */

  /* const handleHousingChange = (date, entries) => {
        const newHousingData = { ...housingData, [date]: entries };
        setHousingData(newHousingData);
        localStorage.setItem('housingData', JSON.stringify(newHousingData));
    }; */

  /* const handleNoteChange = (id, note) => {
    const newUserNotes = { ...userNotes, [id]: note };
    setUserNotes(newUserNotes);
    localStorage.setItem('userNotes', JSON.stringify(newUserNotes)); 
  }; */

  const handleNoteChange = async (uniqueId, note) => {
    // Update local state for immediate UI response
    const updatedPlaces = placesForSelectedDate.map(place => {
        if (place.uniqueId === uniqueId) {
            const updatedPlaceData = { ...place.placesData, userNotes: {[uniqueId]: note} };
            return { ...place, placesData: updatedPlaceData };
        }
        return place;
    });

    // Update the main state to re-render the component
    setPlacesForSelectedDate(updatedPlaces);
    
    // Update the local state for user notes to reflect UI changes immediately
    const newUserNotes = { ...userNotes, [uniqueId]: note };
    console.log("NOTES:::::", newUserNotes)
    setUserNotes(newUserNotes);

    if (!session) {
        // Handle local storage updates for non-authenticated sessions
        const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
        allPlacesByDate[selectedDate] = updatedPlaces;
        localStorage.setItem('addedPlacesByDate', JSON.stringify(allPlacesByDate));
        localStorage.setItem('userNotes', JSON.stringify(newUserNotes));
    } else {
        // Send update to the server for the placesData within the Plan
        try {
          const placesDataResponse = await axios.post('/api/plans/placesData', {
            planId: uniqueId,  // This should be the plan's ID, ensure this is correctly referenced
            updates: { userNotes: { [uniqueId]: note } }
          });
          console.log("Updated userNotes in placesData:", placesDataResponse.data);
      } catch (error) {
          console.error("Error updating userNotes in placesData:", error.response ? error.response.data : error);
      }
    }
};


  

  /* const handleTimeFrameChange = (uniqueId, frame) => {
    const newTimeFrame = { ...timeFrame, [uniqueId]: frame };
    setTimeFrame(newTimeFrame);
    localStorage.setItem('timeFrame', JSON.stringify(newTimeFrame));
  }; */

  

  const handleTimeFrameChange = async (uniqueId, frame) => {
    // Update local state for immediate UI response
    const updatedPlaces = placesForSelectedDate.map(place => {
        if (place.uniqueId === uniqueId) {
            const updatedPlaceData = { ...place.placesData, timeFrame: {[uniqueId]: frame} };
            return { ...place, placesData: updatedPlaceData };
        }
        return place;
    });

    // Update the main state to re-render the component
    setPlacesForSelectedDate(updatedPlaces);

    // Update the local state for user notes to reflect UI changes immediately
    const newTimeFrame = { ...timeFrame, [uniqueId]: frame };
    setTimeFrame(newTimeFrame);

    if (!session) {
        // Handle local storage updates for non-authenticated sessions
        const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
        allPlacesByDate[selectedDate] = updatedPlaces;
        localStorage.setItem('addedPlacesByDate', JSON.stringify(allPlacesByDate));
        localStorage.setItem('timeFrame', JSON.stringify(newTimeFrame));
    } else {
        // Send update to the server for the placesData within the Plan
        try {
          const placesDataResponse = await axios.post('/api/plans/placesData', {
            planId: uniqueId,  // This should be the plan's ID, ensure this is correctly referenced
            updates: { timeFrame: { [uniqueId]: frame } }
          });
          console.log("Updated userNotes in placesData:", placesDataResponse.data);
      } catch (error) {
          console.error("Error updating userNotes in placesData:", error.response ? error.response.data : error);
      }
    }
};
  
  

  const onRemoveButtonClick = (index) => {
    setIndexToRemove(index);
    setShowConfirmModal(true);
  };
  
  const totalPlaceholders = placesForSelectedDate.length < 5 ? 5 - placesForSelectedDate.length : 0;

  /* const onDragEnd = (result) => {
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
  }; */

  const onDragEnd = async (result) => {
    // Do nothing if dropped outside the list
    if (!result.destination) return;

    // Reordering logic
    const reorderedPlaces = Array.from(placesForSelectedDate);
    const [reorderedItem] = reorderedPlaces.splice(result.source.index, 1);
    reorderedPlaces.splice(result.destination.index, 0, reorderedItem);

    // Update local state
    setPlacesForSelectedDate(reorderedPlaces);

    if (session) {
        // Update on the server if session is present
        try {
            // Map reordered places to include new indexes
            const updates = reorderedPlaces.map((place, index) => ({
                ...place,
                index
            }));
            const response = await axios.post('/api/plans/updateIndexes', {
                userId: session.user.id,
                date: selectedDate,
                places: updates
            });
            if (response.status === 200) {
                console.log('Indexes updated successfully on the server.');
            } else {
                console.error('Failed to update indexes on the server.');
            }
        } catch (error) {
            console.error('Error updating indexes on the server:', error);
        }
    } else {
        // Update localStorage if no session
        
        const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
        allPlacesByDate[selectedDate] = reorderedPlaces.map((place, index) => ({
            ...place,
            index  // Ensure each place has the updated index
        }));
        localStorage.setItem('addedPlacesByDate', JSON.stringify(allPlacesByDate));
    }
};


  const [updateTrigger, setUpdateTrigger] = useState(false);

  const triggerMapUpdate = () => {
    setUpdateTrigger(prev => !prev);
  }
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    return (
      <div>
        <div className={`flex flex-col ${activeTab === 'planner' ? 'block' : 'hidden'} items-start bg-gray-200 w-full rounded rounded-tl-none`}>
          <button 
            className="lg:hidden fixed z-30 bottom-4 right-4 bg-coral text-white p-2 rounded-md"
            onClick={toggleSidebar}>
            {isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
          </button>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="placesDroppable">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="flex w-full">
                  <div className="flex flex-col w-full small:w-3/4 bg-white rounded-lg shadow-lg mt-10 lg:ml-5 xl:ml-10 lg:mr-0 mb-10 p-4 mx-0 small:mx-auto">
                    {placesForSelectedDate.map((place, index) => (
                      <Draggable key={`draggable-${index}`} draggableId={`draggable-${index}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              marginBottom: snapshot.isDragging ? "1.5rem" : "0",
                            }}
                          >
                            <PlaceCard
                              key={place.uniqueId}
                              uniqueKey={place.uniqueId}
                              index={index}
                              place={place.details}
                              budget={budget}
                              handleBudgetChange={handleBudgetChange}
                              userNotes={userNotes}
                              handleNoteChange={handleNoteChange}
                              timeFrame={timeFrame[place.uniqueId] || "12:00 AM to 1:00 PM"}
                              handleTimeFrameChange={handleTimeFrameChange}
                              onRemoveButtonClick={onRemoveButtonClick}
                              placesLoaded={placesLoaded}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {showConfirmModal && (
                      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
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
                        <div className=" small:ml-6">
                          <div className=" bg-gray-300 small:w-32 small:h-6 mb-2 rounded"></div>
                          <div className=" bg-gray-300 small:w-48 small:h-4 mb-2 rounded"></div>
                          <div className=" bg-gray-300 small:w-36 small:h-4 mb-2 rounded"></div>
                          <div className=" bg-gray-300 small:w-24 small:h-4 mb-2 rounded"></div>
                          <div className=" bg-gray-300 small:w-24 small:h-4 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`fixed lg:bottom-0 z-20 lg:w-1/4 bottom-6 right-0 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out p-4 mt-6 lg:relative lg:flex-1`}>
                    <BudgetCalculator selectedDate={selectedDate} handleBudgetChange={handleBudgetChange} />
                    <TransportationSelector 
                      selectedDate={selectedDate} 
                      transportationData={transportationData[selectedDate] || []}
                      handleTransportationChange={handleTransportationChange }
                      session={session}
                    />
                    <HousingSelector
                      selectedDate={selectedDate}
                      housingData={housingData[selectedDate] || []} 
                      handleHousingChange={handleHousingChange}
                      session={session}
                    />
                  </div>
                  
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className={`bg-gray-200 w-full rounded-md ${activeTab === 'map' ? 'block' : 'hidden'}`}>
            <MapLoader addresses={addresses} selectedDate={selectedDate} housingData={housingData} updateTrigger={updateTrigger} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded font-mont">
      <div className="flex">
        <button 
          className={`px-6 py-3 rounded rounded-b-none ${activeTab === 'planner' ? 'bg-gray-200 font-semibold' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('planner')}
        >
          Planner
        </button>
        <button 
          className={`px-6 py-3 rounded rounded-b-none ${activeTab === 'map' ? 'bg-gray-200 rounded font-semibold' : 'bg-gray-100'}`}
          onClick={() => {
            setActiveTab('map')
            triggerMapUpdate();
          }}
        >
          Map
        </button>
      </div>
      <div className="">
        {renderContent()}
      </div>
    </div>
  );      
}


export default PlanCreator;
