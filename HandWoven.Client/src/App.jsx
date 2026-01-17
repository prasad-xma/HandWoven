import React from 'react';
import { Routes, Route } from "react-router-dom";
// import { AuthProvider } from './context/AuthProvider';

// pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// defait paeg home
import Home from './pages/Home';

function App() {

  return (

    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>

  );
}

export default App
