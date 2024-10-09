import { Provider } from "react-redux"
import { store } from "./Store/Store"
import { AppRouter } from "./Routes/AppRouter"
import { BrowserRouter } from "react-router-dom"
import { Maps } from "./Incidents/components/Maps"
import './App.css'
export const App = () => {

  return (
    <Provider store={store}>
      <BrowserRouter>
     <AppRouter/> 
     </BrowserRouter>
    </Provider>
  )
}

