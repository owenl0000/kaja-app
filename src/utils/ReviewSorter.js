import React, { useState, useEffect } from "react";

export default function ReviewSorter({ onSortChange }) {
    const [sortOrder, setSortOrder] = useState("");
    console.log(sortOrder);
    useEffect(() => {
        const storedSortOrder = sessionStorage.getItem('reviewSortOrder');
        if (storedSortOrder) {
            setSortOrder(storedSortOrder);
        }
    }, []);

    useEffect(() => {
        if (sortOrder) {
            sessionStorage.setItem('reviewSortOrder', sortOrder);
            onSortChange(sortOrder); // Notify parent component of the change
        }
    }, [sortOrder]);

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
    };

    return (
        <select 
            onChange={handleSortOrderChange} 
            value={sortOrder}
            className="flex flex-col items-center justify-center w-full p-4 mb-2 bg-coral text-white rounded cursor-pointer"
        >
            <option value="">Sort by</option>
            <option value="ascending">Ascending Reviews ↑ </option>
            <option value="descending">Descending Reviews ↓ </option>
            <option value="ratingAscending">Ascending Rating ↑ </option>
            <option value="ratingDescending">Descending Rating ↓</option>
        </select>
    );
}
