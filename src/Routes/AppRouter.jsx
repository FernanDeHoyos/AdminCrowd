import { Navigate, Route, Routes } from "react-router-dom"
import { AuthRouter } from "../Auth/Router/AuthRouter"   
import { IncidentRouter } from "../Incidents/Routes/IncidentRouter" 
import { useAuth } from "../Hooks/useAuth"
import { Backdrop, CircularProgress } from "@mui/material"
import { useEffect, useState } from "react"


export const AppRouter = () => {

  const {CheckAuth, status} = useAuth()
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true)
    CheckAuth()
    CheckAuth(false)
  },[])

   if(status === 'checking'){
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }  

  return (
    <Routes>
    {(status === 'authenticated')
      ? (
        <>
          <Route path="*" element={<IncidentRouter />} />
          <Route path="/*" element={<Navigate to='/' />} />
        </>)
      :
      <>
        <Route path="/auth/*" element={<AuthRouter />} />
        <Route path="/*" element={<Navigate to='/auth/login' />} />
      </>
    }
  </Routes>
  )
}