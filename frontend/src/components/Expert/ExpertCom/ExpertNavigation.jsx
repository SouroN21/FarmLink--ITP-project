import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sample from "../ExpertNavCom/Sample";
import UpdateExpert from "../ExpertNavCom/UpdateExpert"
import ExpertForm from "../../expertListingForm/expertListingForm";
import ExpertAppointmentsPage from "../../expertAppointment/expertAppointmentPage";

const NavPage = () => {

  
    
    return (
        <React.Fragment>
        <section>
          <Routes>
            <Route path="/updateexpert" element={<UpdateExpert />} />
            <Route path="/expert_form" element={<ExpertForm />} />
            <Route path="/appoi" element={<ExpertAppointmentsPage />} />
            <Route path="/*" element={<Sample />} />
          
          </Routes>
        </section>
      </React.Fragment>
    );
  };
  
  export default NavPage;