import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sample from "../BuyerNavCom/Sample";
import UpdateFarmer from "../BuyerNavCom/UpdateBuyer";

const NavPage = () => {

    
    return (
        <React.Fragment>
        <section>
          <Routes>
            <Route path="/updatebuyer" element={<UpdateFarmer />} />
            <Route path="/sample" element={<Sample />} />
          
          </Routes>
        </section>
      </React.Fragment>
    );
  };
  
  export default NavPage;