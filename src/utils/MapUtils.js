
export const getPlaceData = (selectedDate) => {
    const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
    const placeData = allPlacesByDate[selectedDate] || [];
    
    return placeData.map(place => {
        // Replace latitude/longitude with lat/lng if necessary
        const coordinates = place.coordinates 
            ? {
                lat: place.coordinates.latitude ?? place.coordinates.lat,
                lng: place.coordinates.longitude ?? place.coordinates.lng
            } 
            : undefined;

        return {
            ...place,
            coordinates
        };
    });
};


export function getPlacesOptions(selectedDate) {
    const addedPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
    const places = addedPlacesByDate[selectedDate] || [];
    return places.map((place, index) => ({
        value: place.address,
        label: `${place.address} (Place ${index + 1})`,
        lat: place.coordinates.latitude ?? place.coordinates.lat,
        lng: place.coordinates.longitude ?? place.coordinates.lng,
        source: 'place'
    }));
}

import { getGeocode, getLatLng } from "use-places-autocomplete";

export const updateHousingCoordinates = async (address, selectedDate) => {
  console.log("Called");
  try {
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);

    const housingData = JSON.parse(localStorage.getItem('housingData')) || {};
    const dateHousing = housingData[selectedDate] || [];

    const updatedHousing = dateHousing.map(housing => {
      if (housing.address === address) {
        return { ...housing, lat, lng };
      }
      return housing;
    });

    housingData[selectedDate] = updatedHousing;
    localStorage.setItem('housingData', JSON.stringify(housingData));
  } catch (error) {
    console.error('Error updating housing coordinates:', error);
    return { lat: null, lng: null };
  }
};
