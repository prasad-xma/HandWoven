import React from 'react';
import { Routes, Route } from "react-router-dom";
// import { AuthProvider } from './context/AuthProvider';

// pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

import Home from './pages/Home';
import ProtectedRoute from './auth/ProtectedRoute';

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
    </Routes>

  );
}

export default App
