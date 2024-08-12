import React from 'react'
import {SidebarData} from '../AdminSideBarData'
import { NavLink } from "react-router-dom";

const name = localStorage.getItem("firstName");
const email = localStorage.getItem("email");

const Sidebar = () => {
    const activeLink = 'hover:bg-white hover:text-teal-500 bg-teal-500 rounded-xl mt-2 pl-7 w-full h-10 flex justify-start items-center text-white text-sm space-x-1 font-bold'
    const normalLink = 'hover:bg-teal-500 hover:text-white rounded-xl pl-7 mt-2 w-full h-10 flex justify-start items-center text-teal-500 text-sm space-x-1 font-bold'

  return (
    <React.Fragment>
    <section>
      <div className="text-white">
      <div className='block justify-end text-teal-500 text-right mt-5 bg-white rounded-md p-3'>
        <h2 className='block font-bold text-xl'>{name}</h2>
        <h3 className='block text-xs'>{email}</h3>
        </div>
          {
               SidebarData.map((item, index)=>{
                return(
                    <div key={index}>
                        <NavLink to={item.path}
                        className={({ isActive }) =>
                        isActive ? activeLink: normalLink}
                      
                         >
                        
                        <span>{item.title}</span>
                        </NavLink>
                        
                    </div>
                )
              })
          }
  
      </div>
    </section>
  </React.Fragment>
  )
}

export default Sidebar