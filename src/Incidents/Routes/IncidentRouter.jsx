import { Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "../Dashboard/Dashboard"
import { IncidentDialog } from "../pages/IncidentConfirm"



export const IncidentRouter = () => {

    return(
        <>
          <Routes>
            
            <Route path="/Admin" element={<Dashboard/>} />
            <Route path="/Admin/Incident" element={<IncidentDialog/>} />

              
             <Route path="/*" element={<Navigate to="/Admin" />} />

          </Routes>
        </>
    )
}