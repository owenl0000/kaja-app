import React from 'react';
import Image from 'next/image';

// Utility function to convert numerical ratings to Yelp's string format
const convertRatingToString = (rating) => {
  const [whole, fraction] = rating.toString().split('.');
  return fraction ? `${whole}_half` : whole;
};

const YelpStars = ({ rating, type = 'small', multiplier = '1x' }) => {
  const ratingString = convertRatingToString(rating);
  const starImage = `/yelp-stars/${type}/${type}_${ratingString}${multiplier === '1x' ? '' : '@' + multiplier}.png`;

  return (
    <Image 
      src={starImage} 
      alt={`${rating} Yelp Stars`} 
      width={100}  // specify the width
      height={20}  // specify the height
    />
  );
};

export default YelpStars;
