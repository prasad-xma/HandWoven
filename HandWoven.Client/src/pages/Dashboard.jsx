import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  

  return (
    <div className='p-2'>
      <h2>Dashboard</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      {/* Role: {user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]} */}
      
      <button className='mt-2 cursor-pointer p-3 text-white bg-red-500 hover:bg-red-600' onClick={logout}>Logout</button>
      <br />
      
      {user.role === "User" && (
        <button className='mt-2 cursor-pointer' onClick={() => navigate("/seller/register")}>
          Create Seller Account
        </button>
      )}

      {user.role === "Seller" && (
        <button className='mt-4 cursor-pointer bg-green-500 p-3 text-white hover:bg-green-700' onClick={() => navigate("/seller/s-dashboard")}>Seller Dashboard</button>
      )}
    </div>
  );
}

export default Dashboard;