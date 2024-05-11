// components/BudgetCalculator.js
import React, { useState, useEffect } from 'react';

import exchangeRates from '../pages/api/exchangeRates.json';

function BudgetCalculator({ selectedDate, handleBudgetChange}) {
    const [currency, setCurrency] = useState('USD'); // State to hold the selected currency
    const [storedBudgetData, setStoredBudgetData] = useState({});
    // Function to calculate total budget

    useEffect(() => {
        // Retrieve budget data for the selected date from localStorage
        const budgetData = JSON.parse(localStorage.getItem('budgetData'));
        if (budgetData) {
            setStoredBudgetData(budgetData);
        }
    }, [handleBudgetChange]);

    const calculateTotalBudget = () => {
        // Retrieve budget data for the selected date from localStorage
        const budgetForDate = storedBudgetData[selectedDate] || {};

        // Sum up the budget for places on the selected date
        return Object.values(budgetForDate).reduce((total, amount) => {
            return total + parseFloat(amount || 0);
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
        <div className="bg-white px-4 pt-2 pb-1 small:p-4 rounded-lg shadow-md mx-auto text-center mb-1 small:mb-5 z-11">
            <h3 className="text-lg font-semibold text-gray-700">Total Budget for {selectedDate}:</h3>
            <div className="bg-gray-200 small:p-4 rounded-lg mt-1 small:mt-4">
                <p className="text-xl font-bold">
                    ${abbreviateNumber(originalTotal)} / {getCurrencySign(currency)}{abbreviateNumber(convertedTotal)}
                </p>
            </div>
            {/* Currency Type Dropdown */}
            <div className="small:mt-4 mt-1">
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
