// routers.jsx - FIXEDimport { Routes, Route } from "react-router-dom"; 
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";
import CreateProduct from "./CRUD/CreateProduct";
import GetProduct from "./CRUD/GetProduct";
import UpdateProduct from "./CRUD/UpdateProduct";
import PrivateRoute from "./PrivateRoute";
import { Route, Routes } from "react-router-dom";

const Routers = () => {
  return (
    <Routes>
     
    
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/auth/login" element={<Login />} />
  <Route path="/getproduct" element={<GetProduct />} />
     
      <Route element={<PrivateRoute />}>
        <Route path="/createproduct" element={<CreateProduct />} />
        <Route path="/updateproduct/:id" element={<UpdateProduct />} />
      </Route>
    </Routes>
  );
};

export default Routers;