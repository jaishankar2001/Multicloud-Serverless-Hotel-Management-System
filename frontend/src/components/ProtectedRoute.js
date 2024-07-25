import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import validateToken from './validateToken';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await validateToken();
      setIsAuthenticated(result);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    alert("Action not authorized!!!");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
