import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

const TriangleToggle = ({ isOpen, onPrev, onNext }) => {
  return (
    <div className="flex items-center">
      { isOpen ? (
        <button onClick={onNext}>
          <FontAwesomeIcon icon={faCaretRight} size="2x" />
        </button>
      ) : (
        <button onClick={onPrev}>
          <FontAwesomeIcon icon={faCaretLeft} size="2x" />
        </button>
      )}
    </div>
  );
};

export default TriangleToggle;
