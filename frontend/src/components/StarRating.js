import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

export default function StarRating({ value, onChange }) {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div>
            {stars.map((star) => (
                <label key={star}>
                    <input
                        type="radio"
                        name="rating"
                        value={star}
                        checked={value === star}
                        onChange={() => onChange(star)}
                        style={{ display: 'none' }} // Hide the radio input
                    />
                    <FontAwesomeIcon icon={star <= value ? solidStar : regularStar} color={star <= value ? 'gold' : 'gray'} />
                </label>
            ))}
        </div>
    );
}