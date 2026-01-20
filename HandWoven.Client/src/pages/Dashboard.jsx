import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      {/* Role: {user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]} */}
      <button className='mt-2 cursor-pointer' onClick={logout}>Logout</button>
      <br />
      {user.role === "User" && (
        <button className='mt-2 cursor-pointer' onClick={() => navigate("/seller/register")}>
          Create Seller Account
        </button>
      )}
    </div>
  );
}

export default Dashboard;