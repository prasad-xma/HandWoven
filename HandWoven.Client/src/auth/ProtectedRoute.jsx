import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
// import { AuthProvider } from '../context/AuthProvider';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children, roles }) {
  const { user } = useContext(AuthContext);

  if(!user) {
    return <Navigate to="/login" />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" />
  }

  return children;
}

export default ProtectedRoute;