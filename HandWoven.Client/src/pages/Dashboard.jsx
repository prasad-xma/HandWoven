import React, { useContext } from 'react';
import { AuthProvider } from '../context/AuthProvider';

const Dashboard = () => {
  const { user, logout } = useContext(AuthProvider);

  return (
    <>
      <h2>Dashboard</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </>
  )
}

export default Dashboard;