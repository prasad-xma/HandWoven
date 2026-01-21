import React from 'react';
import { Routes, Route } from "react-router-dom";
// import { AuthProvider } from './context/AuthProvider';

// pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

import Home from './pages/Home';
import ProtectedRoute from './auth/ProtectedRoute';
import SellerRegister from './pages/SellerRegister';
import SellerDashboard from './pages/SellerDashboard';
import AddProduct from './pages/product/AddProduct';

function App() {

  return (

    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute roles={["User", "Seller", "Admin", "SysManager"]}>
            <Dashboard />
          </ProtectedRoute>

        } />
        <Route path='/seller/register' element={<SellerRegister />} />
        <Route path='/seller/s-dashboard' element={<SellerDashboard />} />
        <Route path='/seller/addproduct' element={<AddProduct />} />
    </Routes>

  );
}

export default App
