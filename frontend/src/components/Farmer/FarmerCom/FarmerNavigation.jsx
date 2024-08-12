import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sample from "../FarmerNavCom/Sample";
import UpdateFarmer from "../FarmerNavCom/UpdateFarmer";

const NavPage = () => {

  
    
    return (
        <React.Fragment>
        <section>
          <Routes>
            <Route path="/updatefarmer" element={<UpdateFarmer />} />
            <Route path="/sample" element={<Sample />} />
          
          </Routes>
        </section>
      </React.Fragment>
    );
  };
  
  export default NavPage;