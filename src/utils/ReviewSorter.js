import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faMinus } from '@fortawesome/free-solid-svg-icons';

export default function ReviewSorter({ onChange }) {

    const [sortOrder, setSortOrder] = useState("normal");

    useEffect(() => {
        const storedSortOrder = sessionStorage.getItem('reviewSortOrder');
        if (storedSortOrder) {
        setSortOrder(storedSortOrder);
        }
    }, []);

  // Update session storage when sortOrder changes
    useEffect(() => {
        sessionStorage.setItem('reviewSortOrder', sortOrder);
        onChange(sortOrder); // Notify parent component of the change
    }, [sortOrder, onChange]);


    const toggleSortOrder = () => {
        const newOrder = sortOrder === "ascending" ? "descending" : (sortOrder === "descending" ? "normal" : "ascending");
        setSortOrder(newOrder);
        onChange(newOrder); // Propagate the change to the parent
    };

    const arrowIcon = sortOrder === "ascending" ? faArrowUp : (sortOrder === "descending" ? faArrowDown : faMinus);
    const containerStyles = "flex items-center justify-center w-full bg-coral mb-5 text-white p-4 rounded-md cursor-pointer hover:bg-coral-dark active:scale-[0.95]";

    return (
        <button onClick={toggleSortOrder} className={containerStyles}>
        <span className="mr-4">Sort Reviews</span>
        <FontAwesomeIcon icon={arrowIcon} size="lg" />
        </button>
    );
}
