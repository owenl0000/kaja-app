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
        <div className="flex w-full mb-5 bg-coral rounded-md">
            <select 
                onChange={handleSortOrderChange} 
                value={sortOrder}
                className="w-full bg-coral p-5 text-white rounded cursor-pointer"
            >
                <option value="">Sort by</option>
                <option value="ascending">Ascending Reviews ↑ </option>
                <option value="descending">Descending Reviews ↓ </option>
                <option value="ratingAscending">Ascending Rating ↑ </option>
                <option value="ratingDescending">Descending Rating ↓</option>
            </select>
        </div>
    );
}
