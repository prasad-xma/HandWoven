import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  // console.log(user);
  return (
    <>
      <h2>Dashboard</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      {/* Role: {user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]} */}
      <button onClick={logout}>Logout</button>
    </>
  )
}

export default Dashboard;