import { Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "../Dashboard/Dashboard"
import { IncidentDialog } from "../pages/IncidentConfirm"
import { InformationComunas } from "../pages/InformationComunas"




export const IncidentRouter = () => {

    return(
        <>
          <Routes>
            
            <Route path="/Admin" element={<Dashboard/>} />
            <Route path="/Admin/Incident" element={<IncidentDialog/>} />
            <Route path="/Admin/data/:comuna" element={<InformationComunas/>} />

              
             <Route path="/*" element={<Navigate to="/Admin" />} />

          </Routes>
        </>
    )
}