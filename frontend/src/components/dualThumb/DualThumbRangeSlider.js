import React, { useEffect, useState } from 'react';
import './DualTumb.css';

const DualThumbRangeSlider = ({ min, max, onChange }) => {
    // Initialize state with values from localStorage if available, otherwise use props
    const [minVal, setMinVal] = useState(() => {
      const savedMinVal = localStorage.getItem('dualThumbMinVal');
      return savedMinVal !== null ? Number(savedMinVal) : min;
    });
    const [maxVal, setMaxVal] = useState(() => {
      const savedMaxVal = localStorage.getItem('dualThumbMaxVal');
      return savedMaxVal !== null ? Number(savedMaxVal) : max;
    });
  
    // Effect to save the values to localStorage when they change
    useEffect(() => {
      localStorage.setItem('dualThumbMinVal', minVal);
      localStorage.setItem('dualThumbMaxVal', maxVal);
      onChange([minVal, maxVal]);
    }, [minVal, maxVal, onChange]);
  
    // Handlers that set the state
    const handleMinValueChange = (event) => {
      const value = Math.min(Number(event.target.value), maxVal - 1);
      setMinVal(value);
    };
  
    const handleMaxValueChange = (event) => {
      const value = Math.max(Number(event.target.value), minVal + 1);
      setMaxVal(value);
    };


   
  const minValPercentage = ((minVal - min) / (max - min)) * 100;
  const maxValPercentage = ((maxVal - min) / (max - min)) * 100;

  const leftLabelOffset = 20; 
  const leftStyle = {
    left: `calc(${minValPercentage}% - ${leftLabelOffset}px)`,
    transform: 'translateX(-50%)',
  };

const rightLabelOffset = 20; 
const rightStyle = {
  left: `calc(${maxValPercentage}% + ${rightLabelOffset}px)`,
  transform: 'translateX(-50%)'
};
return (
    <div className="dual-thumb-range-slider">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={handleMinValueChange}
        className="thumb thumb--left"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={handleMaxValueChange}
        className="thumb thumb--right"
      />

<div className="slider">
  <div className="slider__track" />
  <div 
    className="slider__range" 
    style={{ left: `${minValPercentage}%`, right: `${100 - maxValPercentage}%` }}
  />
<div 
  className="slider__left-value" 
  style={leftStyle}
>
  ${minVal}
</div>
<div 
  className="slider__right-value" 
  style={rightStyle}
>
  ${maxVal}
</div>
</div>
    </div>
  );
};

export default DualThumbRangeSlider;
