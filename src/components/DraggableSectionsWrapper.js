import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Recommendations from './Recommendations'; // Adjust the import path as needed

const DraggableSectionsWrapper = () => {
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

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(sectionsOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSectionsOrder(items);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {sectionsOrder.map((section, index) => (
              <Draggable key={section} draggableId={section} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Recommendations type={section} />
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
