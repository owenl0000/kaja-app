import React, { useState, useEffect, useRef } from 'react';
import Select, { components } from 'react-select';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome,faMapMarkerAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { getPlacesOptions } from '@/utils/MapUtils';

export default function DestinationSelect({ setDestination, housing, selectedDate, updateTrigger }) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        debounce: 300,
    });

    const [existingAddresses, setExistingAddresses] = useState([]);
    const selectRef = useRef();
    useEffect(() => {
        const housingOptions = housing?.filter(entry => {
          console.log("Entry being processed:", entry);
          return entry.address.trim() !== '' && entry.lat !== null && entry.lng !== null;
        }).map(entry => ({
          value: entry.address,
          label: entry.address,
          lat: entry.lat,
          lng: entry.lng,
          source: 'housing'
        })) || [];
        console.log("Housing Options after processing:", housingOptions);
        const placeOptions = getPlacesOptions(selectedDate);
        console.log("PLACE OPTIONS:", placeOptions);
        setExistingAddresses([...housingOptions, ...placeOptions]);
        if (selectRef.current) {
            selectRef.current.clearValue();
          }
      }, [selectedDate, updateTrigger, housing]);
      
    const handleInputChange = (inputValue) => {
        setValue(inputValue);
    };

    const handleSelect = async (option) => {
        if (!option) {
        
        return;
        }

        clearSuggestions();
        try {
        // Check if the option's address or coordinates already exist in existingAddresses
        const existingEntry = existingAddresses.find(entry => 
            entry.value === option.value && entry.lat === option.lat && entry.lng === option.lng
        );
    
        if (!existingEntry) {
            // Fetch new coordinates if not found in existingAddresses
            const results = await getGeocode({ address: option.value });
            const { lat, lng } = await getLatLng(results[0]);
            setValue(option.value);
            setDestination({ address: option.value, lat, lng });
        } else {
            
            setDestination({ address: option.value, lat: option.lat, lng: option.lng });
            setValue(option.value);
        }
        
        } catch (error) {
        console.error('Error:', error);
        }
    };
  
    const options = data.map((suggestion) => ({
        value: suggestion.description,
        label: suggestion.description,
    })).concat(existingAddresses);

    const CustomOption = (props) => {
        let icon = faSearch; // Default

        
        if (props.data.source === 'housing') {
            icon = faHome;
        } else if (props.data.source === 'place') {
            icon = faMapMarkerAlt;
        }

        return (
            <components.Option {...props}>
                <div className="flex space-x-2">
                    <div>
                        <FontAwesomeIcon icon={icon} fixedWidth/>
                    </div>
                    <div className="truncate max-w-xs hover:max-w-none hover:whitespace-normal">
                        {props.data.label}
                    </div>
                </div>
            </components.Option>
        );
    };  

    const customStyles = {
        control: (provided) => ({
          ...provided,
          borderRadius: '10px', 
          borderWidth: '2px', 
          borderColor: '#ddd', 
          boxShadow: 'none', 
          fontSize: '15px',
          height: '50px', 
          minWidth: '250px',
          minHeight: '50px',
          '&:hover': {
            borderColor: '#aaa', 
          },
        }),
        option: (provided, state) => ({
            ...provided,
            borderBottom: '1px solid #ddd', 
            color: state.isSelected ? 'white' : 'black',
            backgroundColor: state.isSelected ? '#FF6B6B' : 'white',
            '&:hover': {
              backgroundColor: '#FF6B6B',
              color: 'white',
            },
        }),
        
      };

    return (
        <Select
            ref={selectRef}
            isClearable
            onChange={handleSelect}
            onInputChange={handleInputChange}
            options={options}
            components={{ Option: CustomOption }}
            isLoading={!ready}
            placeholder="Destination"
            className="basic-single"
            classNamePrefix="select"
            styles={customStyles}
            theme={(theme) => ({
                ...theme,
                colors: {
                ...theme.colors,
                primary: '#FF6B6B',
                },
            })}
        />
    );
}
