// components/BudgetCalculator.js
import React, { useState, useEffect } from 'react';
import exchangeRates from '../api/exchangeRates.json';

function BudgetCalculator({ addedPlacesByDate, selectedDate, budget }) {
    const [currency, setCurrency] = useState('USD'); // State to hold the selected currency
    // Function to calculate total budget

    
    const calculateTotalBudget = () => {
        // Iterate over the budget object and sum up all the values
        return Object.values(budget).reduce((total, currentBudget) => {
            return total + parseFloat(currentBudget || 0);
        }, 0);
    };


    // Function to abbreviate the number if it's too large
    const abbreviateNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        return num.toFixed(2);
    };

    // Function to get the currency sign
    const getCurrencySign = (selectedCurrency) => {
        const currencySigns = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥',
            'CAD': 'C$',
            'AUD': 'A$',
            'INR': '₹',
            'CNY': '¥',
            'RUB': '₽',
            // Add more currencies and their signs as needed
        };
        return currencySigns[selectedCurrency] || '';
    };

    // Placeholder for currency conversion logic
    const convertCurrency = (amount, selectedCurrency) => {
        const rate = exchangeRates[selectedCurrency] || 1;
        return amount * rate;
    };

    const originalTotal = calculateTotalBudget();
    const convertedTotal = convertCurrency(originalTotal, currency);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md max-w-sm mx-auto text-center">
            <h3 className="text-lg font-semibold text-gray-700">Total Budget for {selectedDate}:</h3>
            <div className="bg-gray-200 p-4 rounded-lg mt-4">
                <p className="text-xl font-bold text-coral">
                    ${abbreviateNumber(originalTotal)} / {getCurrencySign(currency)}{abbreviateNumber(convertedTotal)}
                </p>
            </div>
            {/* Currency Type Dropdown */}
            <div className="mt-4">
                <select 
                    className="bg-coral text-white font-bold py-2 px-4 rounded hover:bg-coral-dark"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                    <option value="INR">INR</option>
                    <option value="CNY">CNY</option>
                    <option value="RUB">RUB</option>
                    {/* Add more currencies as needed */}
                </select>
            </div>
        </div>
    );
}

export default BudgetCalculator;
