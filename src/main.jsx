
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from "react-redux";
import { BrowserRouter,  } from 'react-router'
import Routers from './components/Routers'
import { store } from "./redux/store";


createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routers />
    </BrowserRouter>
  </Provider>

)
 