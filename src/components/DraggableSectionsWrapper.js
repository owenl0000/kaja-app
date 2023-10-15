import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Recommendations from './Recommendations'; // Adjust the import path as needed

const DraggableSectionsWrapper = ({ onAddPlace = () => {} }) => {
  const [sectionsOrder, setSectionsOrder] = useState([
    'area',
    'morning',
    'breakfast',
    'lunch',
    'afternoon',
    'night',
    'dinner',
    'hotels',
  ]);
  const droppableRef = useRef(null);

  const handleOnDragEnd = (result) => {
    // Remove the 'dragging' class regardless of whether the drag was successful
    droppableRef.current.classList.remove('dragging');
  
    // If there's no destination or if the destination is outside the droppable area, return
    if (!result.destination || result.destination.droppableId !== 'sections') {
      return;
    }
  
    const items = Array.from(sectionsOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
  
    setSectionsOrder(items);
  };
  
  
  const handleOnDragStart = () => {
    droppableRef.current.classList.add('dragging'); // Add the class
  };
  

  return (
    <DragDropContext onDragEnd={handleOnDragEnd} onDragStart={handleOnDragStart} mode="SNAP">
      <Droppable droppableId="sections">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={(ref) => {
              provided.innerRef(ref);
              droppableRef.current = ref;
            }}
          >
            {sectionsOrder.map((section, index) => (
              <Draggable key={section} draggableId={section} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Recommendations type={section} onAddPlace={onAddPlace}/>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableSectionsWrapper;
