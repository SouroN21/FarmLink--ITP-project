import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import loaderImg from "../../assets/loader.gif";
import "./Loader.scss";

const Loader = () => {
  const [isTargetAvailable, setIsTargetAvailable] = useState(false);

  useEffect(() => {
    const target = document.getElementById("loader");
    setIsTargetAvailable(!!target);
  }, []);

  if (!isTargetAvailable) {
    return null; // or some fallback UI
  }

  return ReactDOM.createPortal(
    <div className='wrapper'>
      <div className='loader'>
        <img src={loaderImg} alt='Loading..' />
      </div>
    </div>,
    document.getElementById("loader")
  );
  
}
export const  SpinnerImg = () =>{
  return(
      <div className='--center-all'>
          <img src={loaderImg} alt='Loading..'/>
      </div>
  )
}

export default Loader;
