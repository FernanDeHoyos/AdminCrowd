import { configureStore } from "@reduxjs/toolkit"; 
import { IncidentSlice } from "./Incident/IncidentSlice";
import { autchSlice } from "./Auth/AuthSlice";



export const store = configureStore({
    reducer: {
        auth: autchSlice.reducer,
        incident: IncidentSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})