import React from 'react'
import {  useSelector } from 'react-redux'
import { SET_LOGIN, selectName } from '../../redux/features/auth/authSlice';


const Header = () => {

  const name = useSelector(selectName)

  const handleLogout = () => {
		if (localStorage.getItem("token")) {
			localStorage.removeItem("token");
			localStorage.removeItem("role");
			window.location = "/login";
      SET_LOGIN(false)
		} else {
			console.warn("Token not found in localStorage");
		}
	};
  return (
    <div className='--pad header'>
        
        <div className='--flex-between'>
            <h3>
                <span className='--fw-thin'>Welcome,</span>
                <span className='--color-danger'>{name}</span>
            </h3>
           <button onClick={handleLogout} className= "--btn --btn-danger">Logout</button> 
        </div>
        
        
        </div>
  )
}

export default Header