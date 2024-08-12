import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sample from "../DeliveryNavCom/Sample";
import UpdateDelivery from "../DeliveryNavCom/UpdateDelivery";
import ListBuddy from "../../ListBuddy";

const NavPage = () => {

  
    
    return (
        <React.Fragment>
        <section>
          <Routes>
            <Route path="/updatedelivery" element={<UpdateDelivery />} />
            <Route path="/listbuddies" element={<ListBuddy />} />
            <Route path="/*" element={<Sample />} />
          
          </Routes>
        </section>
      </React.Fragment>
    );
  };
  
  export default NavPage;