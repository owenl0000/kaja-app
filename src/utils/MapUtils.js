
export const getPlaceData = (selectedDate) => {
  const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
  const placeData = allPlacesByDate[selectedDate] || [];
  
  return placeData.map(place => {
      // Access coordinates from place.details and replace latitude/longitude with lat/lng if necessary
      const coordinates = place.details && place.details.coordinates
          ? {
              lat: place.details.coordinates.latitude ?? place.details.coordinates.lat,
              lng: place.details.coordinates.longitude ?? place.details.coordinates.lng
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

  return places
      .filter(place => 
          place.details.coordinates && 
          ((place.details.coordinates.latitude !== undefined && place.details.coordinates.longitude !== undefined) || 
           (place.details.coordinates.lat !== undefined && place.details.coordinates.lng !== undefined)))
      .map((place, index) => ({
          value: place.details.address,
          label: `${place.details.address} (Place ${index + 1})`,
          lat: place.details.coordinates.latitude ?? place.details.coordinates.lat,
          lng: place.details.coordinates.longitude ?? place.details.coordinates.lng,
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
