import { Routes, Route, Navigate } from "react-router-dom"
import { Login } from "../pages/Login" 
import { Register } from "../pages/Register"
import { Landing } from "../pages/Landing"


export const AuthRouter = () => {

    return(
        <>
          <Routes>
            <Route path="/home" element={<Landing/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />

              
             <Route path="/*" element={<Navigate to="/home" />} />

          </Routes>
        </>
    )
}