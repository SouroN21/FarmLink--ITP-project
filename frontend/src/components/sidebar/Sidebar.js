import React, { useState } from 'react'
import './Sidebar.scss'
import { HiMenuAlt3 } from "react-icons/hi"
import logo from "../../assets/logo.png"
import menu from '../../data/sidebar'
import Sidebaritem from './Sidebaritem'
import { useNavigate } from 'react-router-dom'


const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true)
    const toggle = () => setIsOpen(!isOpen)
    const navigate = useNavigate()

    const goHome =  () => {
        navigate("/")
    }
    return (
        <div className='layout'>
            <div className='sidebar' style={{ width: isOpen ? "230px" : "60px" }}>

                <div className='top_section'>
                    <div className='logo' style={{ display: isOpen ? "block" : "none" }}>
                    <img src={logo} alt="Logo" style={{ cursor: "pointer" , width:"150%" , height:"150%"}} onClick={goHome}/>
                    </div>

                    <div className='bars' style={{ marginLeft: isOpen ? "140px" : "0px" }}>
                        <HiMenuAlt3 onClick={toggle} />

                    </div>

                </div>
                {menu.map((item,index ) => {
                    return <Sidebaritem key= {index} item = {item} isOpen= {isOpen}/>
                })}


            </div>

            <main style={{paddingLeft: isOpen ? "230px" : "60px",transition: "all .5s"}}>
                {children}
            </main>


        </div>
    )
}

export default Sidebar